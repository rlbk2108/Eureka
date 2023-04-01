from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'courses', views.CourseListView, basename='course')
router.register(r'users', views.UsersListView, basename='user')
router.register(r'lessons', views.LessonListView, basename='lesson')
router.register(r'lesson_blocks', views.LessonBlocksListView, basename='block')

urlpatterns = [
    path('', include(router.urls)),
]
