from django.contrib import admin
from .models import (
    EquipmentParameters,
    LicenseCategories,
    TechType,
    TechStatus,
    Location,
    Parameters, Org, Position, Event
)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)
    list_per_page = 25


@admin.register(Org)
class OrgAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_contractor', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('is_contractor',)
    ordering = ('name',)


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Parameters)
class ParametersAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(EquipmentParameters)
class EquipmentParametersAdmin(admin.ModelAdmin):
    list_display = ('parameters', 'value', 'created_at', 'updated_at')
    search_fields = ('parameters', 'value',)
    ordering = ('parameters',)


@admin.register(LicenseCategories)
class LicenseCategoriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(TechType)
class TechTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(TechStatus)
class TechStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
