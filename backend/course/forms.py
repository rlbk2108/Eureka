from django.contrib.auth.forms import UserCreationForm, UsernameField

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + \
                 ('first_name', 'last_name', 'email', 'password1', 'password2')
        field_classes = {
            'username': UsernameField,
        }
