from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'last_name', 'first_name')
    list_filter = ('is_active', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {
            'fields': ('username',),
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
           'fields': ('last_login', 'date_joined')
        }),
    )

