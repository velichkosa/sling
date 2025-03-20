from django.contrib import admin
from .models import Image, Tag, FormFactor, WorkType


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    # Список полей, отображаемых в списке объектов
    list_display = (
    'title', 'image_preview', 'tags_display', 'form_factors_display', 'work_types_display', 'created_at', 'updated_at',
    'image')

    # Добавляем фильтрацию по тегам, форм-факторам и видам работ
    list_filter = ('tags', 'form_factors', 'work_types')

    # Поле для поиска по названию изображения
    search_fields = ('title', 'description')

    # Сортировка по названию
    ordering = ['title']

    # Возможность редактировать только изображение в списке объектов
    list_editable = ('image',)

    # Указываем, что поле 'title' будет ссылкой для перехода на страницу редактирования
    list_display_links = ('title',)

    # Поля, доступные для редактирования на странице объекта
    fields = ('title', 'image', 'description', 'tags', 'form_factors', 'work_types')

    # Для улучшения визуального восприятия отображаем изображение
    def image_preview(self, obj):
        return f'<img src="{obj.image.url}" width="100" />' if obj.image else 'No image'

    image_preview.allow_tags = True
    image_preview.short_description = 'Image Preview'

    # Отображение тегов как строки
    def tags_display(self, obj):
        return ', '.join([tag.name for tag in obj.tags.all()])

    tags_display.short_description = 'Tags'

    # Отображение форм-факторов как строки
    def form_factors_display(self, obj):
        return ', '.join([form_factor.name for form_factor in obj.form_factors.all()])

    form_factors_display.short_description = 'Form Factors'

    # Отображение типов работ как строки
    def work_types_display(self, obj):
        return ', '.join([work_type.name for work_type in obj.work_types.all()])

    work_types_display.short_description = 'Work Types'

    # Сортировка полей по датам
    readonly_fields = ('created_at', 'updated_at')

    # Добавляем фильтры для полей
    filter_horizontal = ('tags', 'form_factors', 'work_types')
