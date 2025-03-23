from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from elasticsearch_dsl import Q

from dict.models import WorkType, FormFactor
from .models import Image
from .search_indexes import ImageDocument
from .serializers import ImageSerializer

from rest_framework.pagination import PageNumberPagination


class ImagePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]
    pagination_class = ImagePagination  # Add pagination class

    @action(detail=False, methods=['get'], url_path='filter/worktype')
    def filter_by_worktype(self, request):
        worktype_id = request.query_params.get('worktype_id')

        if not worktype_id:
            return Response({"error": "worktype_id is required"}, status=400)

        try:
            worktype = WorkType.objects.get(id=worktype_id)
        except WorkType.DoesNotExist:
            raise NotFound("WorkType не найден")

        # Apply pagination
        images = self.queryset.filter(work_types=worktype)
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(images, request)
        serializer = self.get_serializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='filter/formfactor')
    def filter_by_formfactor(self, request):
        """
        Фильтрация изображений по FormFactor через query-параметр.
        Пример запроса: /api/v1/images/filter/formfactor/?form_factor_id=1
        """
        formfactor_id = request.query_params.get('form_factor_id')

        if not formfactor_id:
            return Response({"error": "form_factor_id is required"}, status=400)

        try:
            form_factor = FormFactor.objects.get(id=formfactor_id)
        except FormFactor.DoesNotExist:  # <-- Исправлено
            raise NotFound("FormFactor не найден")  # <-- Исправлено сообщение

        # Применяем пагинацию
        images = self.queryset.filter(form_factors=form_factor)
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(images, request)
        serializer = self.get_serializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        """Elasticsearch поиск"""

        query = request.GET.get("q", "").strip()
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=400)

        search = ImageDocument.search().query(
            Q(
                "bool",
                should=[
                    Q("match", title__text={"query": query, "boost": 3}),
                    Q("match", description__text={"query": query, "boost": 2}),
                    Q("match", title__ngram={"query": query, "boost": 4}),
                    Q("match", description__ngram={"query": query, "boost": 3}),
                    Q(
                        "nested",
                        path="tags",
                        query=Q(
                            "bool",
                            should=[
                                Q("match", tags__name__text={"query": query, "boost": 2}),
                                Q("match", tags__name__ngram={"query": query, "boost": 3})
                            ]
                        )
                    ),
                    Q("match", title={"query": query, "fuzziness": "AUTO", "boost": 1.5}),
                    Q("match", description={"query": query, "fuzziness": "AUTO", "boost": 1}),
                    Q("prefix", title__raw={"value": query, "boost": 1.2}),
                    Q("match_phrase_prefix", title={"query": query, "boost": 2}),
                    Q("match_phrase_prefix", description={"query": query, "boost": 1.5}),
                ],
                minimum_should_match=1
            )
        ).highlight(
            "title", "description",
            pre_tags=["<b>"], post_tags=["</b>"]
        )

        tag_filter = request.GET.get("tag")
        if tag_filter:
            search = search.filter(
                "nested",
                path="tags",
                query=Q("term", tags__name__raw=tag_filter)
            )

        sort_by = request.GET.get("sort_by", "_score")
        sort_order = "-" if request.GET.get("order", "desc") == "desc" else ""
        if sort_by != "_score":
            search = search.sort(f"{sort_order}{sort_by}")

        page_size = int(request.GET.get("page_size", 10))
        page = int(request.GET.get("page", 1))
        start = (page - 1) * page_size

        response = search[start:start + page_size].execute()

        # Получаем количество результатов
        total_hits = response.hits.total
        total_count = total_hits.value if hasattr(total_hits, "value") else total_hits

        results = []
        for hit in response:
            result = hit.to_dict()
            result["score"] = hit.meta.score

            # ✅ Исправлено: Формируем корректный путь к изображению
            if "image" in result and result["image"]:
                result["image"] = request.build_absolute_uri(result["image"])

            # ✅ Используем встроенное выделение (`highlight`)
            if hasattr(hit.meta, "highlight"):
                highlight_data = hit.meta.highlight
                if "title" in highlight_data:
                    result["title_highlighted"] = highlight_data["title"][0]
                if "description" in highlight_data:
                    result["description_highlighted"] = highlight_data["description"][0]

            results.append(result)

        debug_info = None
        if request.GET.get("debug") == "true":
            debug_info = {"query": search.to_dict()}

        return Response({
            "count": total_count,
            "results": results,
            "page": page,
            "page_size": page_size,
            "pages_total": (total_count + page_size - 1) // page_size,
            "debug": debug_info
        })

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
