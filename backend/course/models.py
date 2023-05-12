import os
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models

from .managers import CustomUserManager


class Images(models.Model):
    img_description = models.CharField(max_length=150, default='Image description', null=True)
    image = models.ImageField(upload_to='pics')


class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    poster = models.ImageField(upload_to='pics', null=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    price = models.PositiveIntegerField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    objects = settings.AUTH_USER_MODEL

    def __str__(self):
        return self.title


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    taken_courses = models.ManyToManyField(Course, related_name='taken_by_me', blank=True)
    created_courses = models.ManyToManyField(Course, related_name='my_created', blank=True,
                                             )


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True, related_name='lessons')
    lesson_title = models.CharField(max_length=100)
    lesson_description = models.CharField(max_length=500)


class LessonBlock(models.Model):
    block_title = models.CharField(max_length=100)
    block_text = models.CharField(max_length=500)
    block_image = models.ForeignKey(Images, on_delete=models.CASCADE, blank=True, null=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, related_name='lesson_blocks',
                               blank=True)


class CustomUser(AbstractUser, PermissionsMixin):
    first_name = models.CharField(max_length=100, editable=True, null=True)
    last_name = models.CharField(max_length=100, editable=True, null=True)
    username = models.CharField(db_index=True, max_length=100, editable=True, unique=True)
    email = models.EmailField(db_index=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.username

    @property
    def get_id(self):
        return self.pk

    @property
    def token(self):
        """
        Позволяет получить токен пользователя путем вызова user.token, вместо
        user._generate_jwt_token(). Декоратор @property выше делает это
        возможным. token называется "динамическим свойством".
        """
        return self._generate_jwt_token()

    def get_full_name(self):
        """
        Этот метод требуется Django для таких вещей, как обработка электронной
        почты. Обычно это имя и фамилия пользователя.
        """
        return f'{self.first_name} {self.last_name}'

    def get_short_name(self):
        """ Аналогично методу get_full_name(). """
        return self.first_name

    def _generate_jwt_token(self):
        """
        Генерирует веб-токен JSON, в котором хранится идентификатор этого
        пользователя, срок действия токена составляет 1 день от создания
        """
        dt = datetime.now() + timedelta(days=1)

        token = jwt.encode({
            'username': self.username,
            'id': self.pk,
            'exp': int(dt.strftime('%S')),
        }, os.environ.get("SECRET_KEY"), algorithm='HS256')
        return token
