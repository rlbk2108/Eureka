import select
from django.contrib import admin
from .models import CustomUser, Course, Lesson, LessonBlock, Images, Profile


admin.site.register(LessonBlock)
admin.site.register(Images)
admin.site.register(Profile)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    pass


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'price')
    list_filter = ('price', 'author')


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'email')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'first_name')
    # radio_fields = {'groups': admin.VERTICAL}
    readonly_fields = ('password',)

    @admin.display(empty_value='???')
    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'

    fieldsets = (
        (None, {
            'fields': ('username', 'password'),
        }),
        ('Personal info', {
            'fields': (('first_name', 'last_name',), 'email'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )
