from django.views.generic import ListView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsOwnerOrReadOnly


from .serializers import CourseSerializer, UserSerializer, LessonSerializer, LessonBlockSerializer
from .models import Course, CustomUser, Lesson, LessonBlock


class CourseListView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]


class UsersListView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LessonListView(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]


class LessonBlocksListView(viewsets.ModelViewSet):
    queryset = LessonBlock.objects.all()
    serializer_class = LessonBlockSerializer
    permission_classes = [AllowAny]
