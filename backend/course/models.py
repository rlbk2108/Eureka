from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager


class Course(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    content = models.TextField()
    price = models.TextField()
    author = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


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
            'id': self.pk,
            'exp': int(dt.strftime('%S'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token
