from django.contrib import admin
from .models import CustomUser, Course

admin.site.register(Course)


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'email')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'first_name')

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

