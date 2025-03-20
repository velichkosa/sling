from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from .models import Image

# Создаем индекс
image_index = Index('images')


@registry.register_document
class ImageDocument(Document):
    # Определяем основные поля
    title = fields.TextField(
        attr='title',
        analyzer='russian_analyzer',
        search_analyzer='russian_search_analyzer',  # Отдельный анализатор для поиска
        fields={
            'raw': fields.KeywordField(),
            'suggest': fields.CompletionField(),
            'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
            'ngram': fields.TextField(analyzer='ngram_analyzer'),  # Добавляем поле с n-граммами
        }
    )

    description = fields.TextField(
        attr='description',
        analyzer='russian_analyzer',
        search_analyzer='russian_search_analyzer',
        fields={
            'raw': fields.KeywordField(),
            'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
            'ngram': fields.TextField(analyzer='ngram_analyzer'),  # Добавляем поле с n-граммами
        }
    )

    # Определяем связанные поля (nested fields)
    tags = fields.NestedField(properties={
        'name': fields.TextField(
            analyzer='russian_analyzer',
            search_analyzer='russian_search_analyzer',
            fields={
                'raw': fields.KeywordField(),
                'suggest': fields.CompletionField(),
                'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
                'ngram': fields.TextField(analyzer='ngram_analyzer'),  # Добавляем поле с n-граммами
            }
        ),
        'id': fields.KeywordField(),
    })

    form_factors = fields.NestedField(properties={
        'name': fields.TextField(
            analyzer='russian_analyzer',
            search_analyzer='russian_search_analyzer',
            fields={
                'raw': fields.KeywordField(),
                'suggest': fields.CompletionField(),
                'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
                'ngram': fields.TextField(analyzer='ngram_analyzer'),  # Добавляем поле с n-граммами
            }
        ),
        'id': fields.KeywordField(),
    })

    work_types = fields.NestedField(properties={
        'name': fields.TextField(
            analyzer='russian_analyzer',
            search_analyzer='russian_search_analyzer',
            fields={
                'raw': fields.KeywordField(),
                'suggest': fields.CompletionField(),
                'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
                'ngram': fields.TextField(analyzer='ngram_analyzer'),  # Добавляем поле с n-граммами
            }
        ),
        'id': fields.KeywordField(),
    })

    class Index:
        name = 'images'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'filter': {
                    'russian_stop': {
                        'type': 'stop',
                        'stopwords': '_russian_'
                    },
                    'russian_stemmer': {
                        'type': 'stemmer',
                        'language': 'russian'
                    },
                    'word_delimiter_filter': {
                        'type': 'word_delimiter',
                        'split_on_numerics': True,
                        'preserve_original': True
                    },
                    'ngram_filter': {  # Добавляем фильтр для n-грамм
                        'type': 'edge_ngram',
                        'min_gram': 2,
                        'max_gram': 20,
                        'side': 'front'
                    }
                },
                'analyzer': {
                    'russian_analyzer': {
                        'type': 'custom',
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'russian_stop',
                            'word_delimiter_filter',
                            'russian_stemmer'
                        ]
                    },
                    'russian_search_analyzer': {  # Анализатор для поиска (без n-грамм)
                        'type': 'custom',
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'russian_stop',
                            'word_delimiter_filter',
                            'russian_stemmer'
                        ]
                    },
                    'ngram_analyzer': {  # Анализатор для n-грамм
                        'type': 'custom',
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'ngram_filter'
                        ]
                    }
                }
            }
        }

    class Django:
        model = Image
        related_models = ['tags.Tag', 'form_factors.FormFactor', 'work_types.WorkType']
        fields = [
            'id',
            'created_at',
            'updated_at',
        ]

    # Получаем данные из связанных моделей
    def prepare_tags(self, instance):
        return [{'name': tag.name, 'id': str(tag.id)} for tag in instance.tags.all()]

    def prepare_form_factors(self, instance):
        return [{'name': form_factor.name, 'id': str(form_factor.id)} for form_factor in instance.form_factors.all()]

    def prepare_work_types(self, instance):
        return [{'name': work_type.name, 'id': str(work_type.id)} for work_type in instance.work_types.all()]

    # Метод для обновления индекса при изменении связанных моделей
    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, self.Django.model):
            return [related_instance]
        return related_instance.images.all()