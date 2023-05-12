from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .models import Course, CustomUser, Lesson, LessonBlock, Images, Profile
from rest_framework.utils.field_mapping import get_nested_relation_kwargs


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = CustomUser
        depth = 1
        fields = ['url', 'username', 'first_name', 'last_name', 'email', 'password', 'courses']
        extra_kwargs = {'password': {'write_only': True},
                        'courses': {'read_only': True}
                        }

    def build_nested_field(self, field_name, relation_info, nested_depth):
        class NestedSerializer(serializers.ModelSerializer):
            class Meta:
                model = relation_info.related_model
                depth = nested_depth - 1
                exclude = ['author']

        field_class = NestedSerializer
        field_kwargs = get_nested_relation_kwargs(relation_info)

        return field_class, field_kwargs


class RegistrationSerializer(serializers.ModelSerializer):
    """ Сериализация регистрации пользователя и создания нового. """

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    # Клиентская сторона не должна иметь возможность отправлять токен вместе с
    # запросом на регистрацию. Сделаем его доступным только на чтение.
    token = serializers.CharField(max_length=1000, read_only=True)
    # refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'token']

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class LessonBlockSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='block-detail')
    block_image = serializers.HyperlinkedRelatedField(queryset=Images.objects.all(),
                                                      view_name='image-detail')

    class Meta:
        model = LessonBlock
        fields = ['url', 'id', 'block_title', 'block_text', 'block_image']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        # В методе validate мы убеждаемся, что текущий экземпляр
        # LoginSerializer значение valid. В случае входа пользователя в систему
        # это означает подтверждение того, что присутствуют адрес электронной
        # почты и то, что эта комбинация соответствует одному из пользователей.
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None:
            raise serializers.ValidationError(
                'An username address is required to log in.'
            )

        # Вызвать исключение, если не предоставлен пароль.
        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        # Метод authenticate предоставляется Django и выполняет проверку, что
        # предоставленные почта и пароль соответствуют какому-то пользователю в
        # нашей базе данных.
        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password was not found.'
            )

        # Django предоставляет флаг is_active для модели User. Его цель
        # сообщить, был ли пользователь деактивирован или заблокирован.
        # Проверить стоит, вызвать исключение в случае True.
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        # Метод validate должен возвращать словать проверенных данных. Это
        # данные, которые передются в т.ч. в методы create и update.
        return {
            'username': user.username,
            'token': user.token
        }


class LessonSerializer(serializers.HyperlinkedModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    lesson_blocks = serializers.HyperlinkedRelatedField(many=True, queryset=LessonBlock.objects.all(),
                                                        view_name='block-detail')

    class Meta:
        model = Lesson
        depth = 1
        fields = ['url', 'course', 'lesson_title', 'lesson_description', 'lesson_blocks']


class CourseSerializer(serializers.HyperlinkedModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        depth = 2
        fields = ['url', 'id', 'title', 'description', 'poster', 'lessons', 'price', 'author', 'discount']

    def build_nested_field(self, field_name, relation_info, nested_depth):
        class NestedSerializer(serializers.ModelSerializer):
            class Meta:
                model = relation_info.related_model
                depth = nested_depth - 1
                fields = ['username', 'url']

        field_class = NestedSerializer
        field_kwargs = get_nested_relation_kwargs(relation_info)

        return field_class, field_kwargs

    def create(self, validated_data):
        if int(validated_data['price']) > 50:
            validated_data['discount'] = str(float(validated_data['price']) / 30)
        else:
            validated_data['discount'] = 0

        return Course.objects.create(**validated_data)


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    taken_courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all())

    class Meta:
        model = Profile
        depth = 1
        fields = ['url', 'user', 'taken_courses', 'created_courses']
        extra_kwargs = {'taken_courses': {'read_only': False}}

    def build_nested_field(self, field_name, relation_info, nested_depth):
        class NestedSerializer(serializers.ModelSerializer):
            class Meta:
                model = relation_info.related_model
                depth = nested_depth - 1
                exclude = ['author']

        field_class = NestedSerializer
        field_kwargs = get_nested_relation_kwargs(relation_info)

        return field_class, field_kwargs


class ImagesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Images
        fields = '__all__'
