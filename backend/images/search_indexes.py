from django.conf import settings
from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from .models import Image

# Создаем индекс
image_index = Index('images')


@registry.register_document
class ImageDocument(Document):
    image = fields.KeywordField()

    def prepare_image(self, instance):
        """Формируем полный URL изображения перед индексированием"""
        if instance.image:
            return f"{settings.MEDIA_URL}{instance.image}"
        return None

    # Основные поля
    title = fields.TextField(
        attr='title',
        analyzer='russian_analyzer',
        search_analyzer='russian_search_analyzer',
        fields={
            'raw': fields.KeywordField(),
            'suggest': fields.CompletionField(),
            'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
            'ngram': fields.TextField(analyzer='ngram_analyzer'),
        }
    )

    description = fields.TextField(
        attr='description',
        analyzer='russian_analyzer',
        search_analyzer='russian_search_analyzer',
        fields={
            'raw': fields.KeywordField(),
            'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
            'ngram': fields.TextField(analyzer='ngram_analyzer'),
        }
    )

    # Поле tags (связанные объекты)
    tags = fields.NestedField(properties={
        'id': fields.KeywordField(),
        'name': fields.TextField(
            analyzer='russian_analyzer',
            search_analyzer='russian_search_analyzer',
            fields={
                'raw': fields.KeywordField(),
                'suggest': fields.CompletionField(),
                'text': fields.TextField(analyzer='russian_analyzer', search_analyzer='russian_search_analyzer'),
                'ngram': fields.TextField(analyzer='ngram_analyzer'),
            }
        ),
    })

    # Новые поля: form_factors и work_types
    form_factors = fields.NestedField(properties={
        'id': fields.KeywordField(),
        'name': fields.KeywordField(),
    })

    work_types = fields.NestedField(properties={
        'id': fields.KeywordField(),
        'name': fields.KeywordField(),
    })

    approved_slings = fields.NestedField(properties={
        'id': fields.KeywordField(),
        'name': fields.KeywordField(),
        'description': fields.KeywordField(),
        'image': fields.KeywordField(attr='image.url')  # Используем image.url вместо image
    })

    class Index:
        name = 'images'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'filter': {
                    'russian_stop': {'type': 'stop', 'stopwords': '_russian_'},
                    'russian_stemmer': {'type': 'stemmer', 'language': 'russian'},
                    'word_delimiter_filter': {'type': 'word_delimiter', 'split_on_numerics': True,
                                              'preserve_original': True},
                    'ngram_filter': {'type': 'edge_ngram', 'min_gram': 2, 'max_gram': 20, 'side': 'front'}
                },
                'analyzer': {
                    'russian_analyzer': {
                        'type': 'custom', 'tokenizer': 'standard',
                        'filter': ['lowercase', 'russian_stop', 'word_delimiter_filter', 'russian_stemmer']
                    },
                    'russian_search_analyzer': {
                        'type': 'custom', 'tokenizer': 'standard',
                        'filter': ['lowercase', 'russian_stop', 'word_delimiter_filter', 'russian_stemmer']
                    },
                    'ngram_analyzer': {
                        'type': 'custom', 'tokenizer': 'standard',
                        'filter': ['lowercase', 'ngram_filter']
                    }
                }
            }
        }

    class Django:
        model = Image
        related_models = ['tags.Tag', 'form_factors.FormFactor', 'work_types.WorkType', 'approved_slings.Slings']
        fields = ['id', 'created_at', 'updated_at']

    def get_instances_from_related(self, related_instance):
        if isinstance(related_instance, self.Django.model):
            return [related_instance]
        return related_instance.images.all()
