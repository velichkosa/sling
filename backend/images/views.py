from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from elasticsearch_dsl import Q

from dict.models import WorkType
from .models import Image
from .search_indexes import ImageDocument
from .serializers import ImageSerializer


class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='filter/worktype')
    def filter_by_worktype(self, request):
        """
        Фильтрация изображений по WorkType через query-параметр.
        Пример запроса: /api/v1/images/filter/worktype/?worktype_id=1
        """
        worktype_id = request.query_params.get('worktype_id')

        if not worktype_id:
            return Response({"error": "worktype_id is required"}, status=400)

        try:
            worktype = WorkType.objects.get(id=worktype_id)
        except WorkType.DoesNotExist:
            raise NotFound("WorkType не найден")

        images = self.queryset.filter(work_types=worktype)
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        """Elasticsearch поиск"""

        query = request.GET.get("q", "")
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=400)

        # Используем улучшенный поиск с поддержкой морфологии и n-грамм
        search = ImageDocument.search().query(
            Q(
                "bool",
                should=[
                    # Поиск по обычным полям с использованием поля .text
                    # которое обрабатывается russian_analyzer
                    Q("match", title__text={"query": query, "boost": 3}),
                    Q("match", description__text={"query": query, "boost": 2}),

                    # Поиск по n-граммам для частичных совпадений
                    Q("match", title__ngram={"query": query, "boost": 4}),
                    Q("match", description__ngram={"query": query, "boost": 3}),

                    # Поиск по вложенным полям с использованием морфологии
                    Q(
                        "nested",
                        path="tags",
                        query=Q(
                            "bool",
                            should=[
                                Q("match", tags__name__text={"query": query, "boost": 2}),
                                Q("match", tags__name__ngram={"query": query, "boost": 3})  # Добавляем n-граммы
                            ]
                        )
                    ),

                    # Добавляем нечеткий поиск для похожих слов
                    Q("match", title={"query": query, "fuzziness": "AUTO", "boost": 1.5}),
                    Q("match", description={"query": query, "fuzziness": "AUTO", "boost": 1}),

                    # Поиск по префиксу (оставляем, так как он бывает полезен)
                    Q("prefix", title__raw={"value": query, "boost": 1.2}),

                    # Добавляем поиск с использованием phrase_prefix для лучшего поиска фраз
                    Q("match_phrase_prefix", title={"query": query, "boost": 2}),
                    Q("match_phrase_prefix", description={"query": query, "boost": 1.5}),
                ],
                minimum_should_match=1
            )
        )

        # Добавляем фильтрацию по конкретным полям
        tag_filter = request.GET.get("tag")

        if tag_filter:
            search = search.filter(
                "nested",
                path="tags",
                query=Q("term", tags__name__raw=tag_filter)
            )

        # Добавляем возможность сортировки
        sort_by = request.GET.get("sort_by", "_score")  # По умолчанию сортируем по релевантности
        sort_order = "-" if request.GET.get("order", "desc") == "desc" else ""

        # Если сортировка не по релевантности, добавляем её
        if sort_by != "_score":
            search = search.sort(f"{sort_order}{sort_by}")

        # Добавляем пагинацию
        page_size = int(request.GET.get("page_size", 10))
        page = int(request.GET.get("page", 1))
        start = (page - 1) * page_size
        end = start + page_size

        # Выполняем поиск
        response = search[start:end].execute()

        # Формируем подробный ответ
        results = []
        for hit in response:
            result = hit.to_dict()
            result["score"] = hit.meta.score

            # ✅ Добавляем полный путь к изображению
            if "image" in result and result["image"]:
                result["image"] = request.build_absolute_uri(result["image"])

            # Улучшаем подсветку совпадений для частичных совпадений
            if hasattr(hit, 'title') and hit.title:
                title = hit.title
                title_lower = title.lower()
                query_lower = query.lower()

                # Ищем все вхождения запроса (включая частичные)
                if query_lower in title_lower:
                    result["title_highlighted"] = self._highlight_matches(title, query)
                else:
                    # Ищем частичные совпадения (подстроки)
                    for word in title.split():
                        word_lower = word.lower()
                        if query_lower in word_lower or word_lower in query_lower:
                            result["title_highlighted"] = self._highlight_matches(title, word)
                            break

            if hasattr(hit, 'description') and hit.description:
                desc = hit.description
                desc_lower = desc.lower()

                # Ищем все вхождения запроса (включая частичные)
                if query_lower in desc_lower:
                    result["description_highlighted"] = self._highlight_matches(desc, query)
                else:
                    # Ищем частичные совпадения (подстроки)
                    for word in desc.split():
                        word_lower = word.lower()
                        if query_lower in word_lower or word_lower in query_lower:
                            result["description_highlighted"] = self._highlight_matches(desc, word)
                            break

            results.append(result)

        # Для отладки возвращаем DSL запрос
        debug_info = None
        if request.GET.get("debug") == "true":
            debug_info = {
                "query": search.to_dict()
            }

        return Response({
            "count": response.hits.total.value if hasattr(response.hits.total, 'value') else response.hits.total,
            "results": results,
            "page": page,
            "page_size": page_size,
            "pages_total": (int(response.hits.total.value if hasattr(response.hits.total,
                                                                     'value') else response.hits.total) + page_size - 1) // page_size,
            "debug": debug_info
        })

    # Вспомогательный метод для подсветки совпадений
    def _highlight_matches(self, text, query):
        import re
        pattern = re.compile(re.escape(query), re.IGNORECASE)
        return pattern.sub(lambda m: f"<mark>{m.group(0)}</mark>", text)

    # Метод для получения подсказок при поиске
    @action(detail=False, methods=["get"])
    def suggest(self, request):
        query = request.GET.get("q", "")
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=400)

        # Используем completion suggester для быстрых подсказок
        s = ImageDocument.search()
        s = s.suggest(
            'title_suggestions',
            query,
            completion={
                'field': 'title.suggest',
                'fuzzy': {
                    'fuzziness': 1
                },
                'size': 5
            }
        )

        # Добавляем подсказки для тегов
        s = s.suggest(
            'tag_suggestions',
            query,
            completion={
                'field': 'tags.name.suggest',
                'fuzzy': {
                    'fuzziness': 1
                },
                'size': 5
            }
        )

        # Выполняем запрос
        response = s.execute()

        # Собираем все уникальные подсказки
        suggestions = set()

        # Добавляем подсказки из разных полей
        if hasattr(response, 'suggest') and hasattr(response.suggest, 'title_suggestions'):
            for suggestion in response.suggest.title_suggestions[0].options:
                suggestions.add(suggestion.text)

        if hasattr(response, 'suggest') and hasattr(response.suggest, 'tag_suggestions'):
            for suggestion in response.suggest.tag_suggestions[0].options:
                suggestions.add(suggestion.text)

        # Возвращаем отсортированный список подсказок
        return Response({
            "suggestions": sorted(list(suggestions))
        })
