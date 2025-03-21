from django.contrib import admin
from django.utils.html import format_html

from dict.models import FormFactor, WorkType, Tag, Slings


@admin.register(FormFactor)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(WorkType)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Slings)
class SlingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_preview', 'description_short')
    search_fields = ('name', 'description')
    list_filter = ('name',)
    readonly_fields = ('image_preview',)
    fields = ('name', 'image', 'image_preview', 'description')

    def image_preview(self, obj):
        """Отображает превью изображения в админке."""
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 150px;" />', obj.image.url)
        return "Нет изображения"

    image_preview.short_description = "Превью изображения"

    def description_short(self, obj):
        """Ограничивает длину описания в списке для удобства."""
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description

    description_short.short_description = "Описание"
