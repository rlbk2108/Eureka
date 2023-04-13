from django.apps import AppConfig
from django.db.models.signals import pre_save
from django.dispatch import receiver


class CourseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'course'
    #
    # def ready(self):
    #     # importing model classes
    #     from .models import LessonBlock, Lesson, CustomUser, Course
    #     # CRS = apps.get_model('course', 'Course')
    #
    #     # registering signals with the model's string label
    #     pre_save.connect(receiver, sender='app_label.CustomUser')
    #     pre_save.connect(receiver, sender='app_label.Course')
    #     pre_save.connect(receiver, sender='app_label.Lesson')
    #     pre_save.connect(receiver, sender='app_label.LessonBlock')
