from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Org, Position, Users




@admin.register(Users)
class CustomUserAdmin(UserAdmin):
    model = Users
    list_display = ('username', 'email', 'phone', 'org', 'position', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'org', 'position', 'role')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name', 'org__name', 'position__name')
    ordering = ('username',)
    autocomplete_fields = ['org', 'position', 'role']

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'phone', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'org', 'position', 'role')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'org', 'position', 'role')
        }),
    )
