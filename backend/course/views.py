import json

import jwt
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import ListView
from rest_framework.response import Response
from rest_framework import viewsets, status, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .forms import CustomUserCreationForm
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CourseSerializer, UserSerializer, \
    LessonSerializer, LessonBlockSerializer, ImagesSerializer, RegistrationSerializer, LoginSerializer, ProfileSerializer
from .models import Course, CustomUser, Lesson, LessonBlock, Images, Profile
from .renderers import UserJSONRenderer
from django.conf import settings


class CourseListView(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('author', 'author')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # инизиализируем сериализатор, используя serializer_class
        # в данном случае, он указывает на CourseSerializer
        serializer = self.serializer_class(data=request.data, context={"request": request})

        # проверка на валидность сериализатора
        if serializer.is_valid():
            # сохраняем сериализатор с указанием автора
            # тот самый проблемный момент
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def search(self, request):
        search_term = request.query_params.get('q')
        if not search_term:
            return Response([])
        queryset = self.queryset.filter(title__icontains=search_term)
        serializer = self.serializer_class(queryset=queryset, many=True)
        serializer.is_valid()
        return Response(serializer.data)

    @action(detail=True)
    def take_course(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, many=True)
        serializer.is_valid()
        print(serializer)
        return Response(serializer.data)


class ProfileView(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        courses = Course.objects.filter(author_id=request.data['user'])
        if serializer.is_valid():
            serializer.save(created_courses=courses)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersListView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            form = CustomUserCreationForm(request.data)
            if form.is_valid():
                form.save()
                return Response(form.data, status=status.HTTP_201_CREATED)
        return Response(request.data, status=status.HTTP_403_FORBIDDEN)


class RegistrationAPIView(APIView):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = {'username': request.data['username'],
                'email': request.data['email'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'password': request.data['password']}
        print(request.user)
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # Обратите внимание, что мы не вызываем метод save() сериализатора, как
        # делали это для регистрации. Дело в том, что в данном случае нам
        # нечего сохранять. Вместо этого, метод validate() делает все нужное.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        response = Response(serializer.data, status=status.HTTP_200_OK)

        return response


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class LessonListView(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]


class LessonBlocksListView(viewsets.ModelViewSet):
    queryset = LessonBlock.objects.all()
    serializer_class = LessonBlockSerializer
    permission_classes = [AllowAny]


class ImagesView(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = ImagesSerializer
    permission_classes = [AllowAny]
