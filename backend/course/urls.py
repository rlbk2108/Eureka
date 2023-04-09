from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import RegistrationAPIView, LoginAPIView

router = DefaultRouter()

router.register(r'courses', views.CourseListView, basename='course')
router.register(r'users', views.UsersListView, basename='user')
router.register(r'lessons', views.LessonListView, basename='lesson')
router.register(r'lesson_blocks', views.LessonBlocksListView, basename='block')
router.register(r'images', views.ImagesView, basename='image')


# добавил сюда дополнительные url'ы для проверки работоспособности сериализаторов (Registration/Login Serializer)
urlpatterns = [
    path('', include(router.urls)),
    path('ausers/', RegistrationAPIView.as_view()),
    path('ausers/login/', LoginAPIView.as_view()),
]
