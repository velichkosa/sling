from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType

from django.utils.html import escape
from django.urls import reverse

from .models import Shifts, ShiftEvent, Equipment, Operator, Tech


# class LicenseCategoriesInline(admin.TabularInline):
#     model = Operator.license_categories.through
#     extra = 1
#     verbose_name = 'Категория ВУ'
#     verbose_name_plural = 'Категории ВУ'


class EquipmentInline(admin.TabularInline):
    model = Tech.equipment.through
    extra = 1
    verbose_name = 'Оборудование'
    verbose_name_plural = 'Оборудование'


@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'org', 'phone_number', 'experience', 'created_at', 'updated_at')
    search_fields = ('first_name', 'last_name', 'org__name')
    list_filter = ('org',)
    ordering = ('last_name',)
    autocomplete_fields = ['org', 'license_categories']

    # inlines = [LicenseCategoriesInline]

    class Media:
        # Подключаем свой CSS
        css = {
            'all': ('admin/css/custom.css',),
        }


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)
    autocomplete_fields = ('parameters',)

    # Переопределяем метод для отображения имени с параметрами в админке
    def name_with_params(self, obj):
        params = ", ".join([str(param) for param in obj.parameters.all()])
        return f"{obj.name} ({params})"

    name_with_params.admin_order_field = 'name'  # Чтобы сортировка по этому полю работала правильно
    name_with_params.short_description = 'Оборудование с параметрами'


@admin.register(Tech)
class TechAdmin(admin.ModelAdmin):
    list_display = ('gos_num', 'type', 'org', 'status', 'home_location', 'is_active', 'created_at', 'updated_at')
    search_fields = ('gos_num', 'type__name', 'org__name', 'status__name', 'home_location__name')
    list_filter = ('type', 'status', 'org', 'home_location', 'is_active')
    ordering = ('type',)
    autocomplete_fields = ['type', 'status', 'home_location', 'org']
    inlines = [EquipmentInline]
    fieldsets = (
        (None, {
            'fields': ('gos_num', 'is_active')
        }),
        ('Технические данные', {
            'fields': ('org', 'type', 'status', 'home_location')
        }),
    )


@admin.register(Shifts)
class ShiftsAdmin(admin.ModelAdmin):
    list_display = ('tech', 'start_time', 'end_time', 'created_at')
    list_filter = ('tech', 'start_time')
    search_fields = ('tech__name',)
    ordering = ('-start_time',)
    list_per_page = 25

    def get_queryset(self, request):
        # Оптимизация запросов для связей
        qs = super().get_queryset(request)
        return qs.select_related('tech')


@admin.register(ShiftEvent)
class ShiftEventAdmin(admin.ModelAdmin):
    list_display = ('shift', 'event', 'start_time', 'end_time', 'confirmation', 'created_at')
    list_filter = ('event', 'start_time', 'confirmation')
    search_fields = ('shift__equipment__name', 'state__name',)
    ordering = ('-start_time',)
    list_per_page = 25

    def get_queryset(self, request):
        # Оптимизация запросов для связей
        qs = super().get_queryset(request)
        return qs.select_related('shift', 'event')


@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    date_hierarchy = 'action_time'
    list_display = ('action_time', 'user', 'content_type', 'object_link', 'action_flag', 'change_message')
    list_filter = ('action_flag', 'content_type')
    search_fields = ('object_repr', 'change_message')

    def object_link(self, obj):
        if obj.action_flag == 1:  # Добавлено
            return escape(obj.object_repr)
        elif obj.action_flag == 2:  # Изменено
            ct = ContentType.objects.get_for_id(obj.content_type_id)
            return '<a href="{}">{}</a>'.format(
                reverse('admin:%s_%s_change' % (ct.app_label, ct.model), args=[obj.object_id]),
                escape(obj.object_repr),
            )
        elif obj.action_flag == 3:  # Удалено
            return escape(obj.object_repr)
        return ''

    object_link.allow_tags = True
    object_link.short_description = 'Объект'
