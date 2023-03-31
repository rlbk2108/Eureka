from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, username, first_name=None, last_name=None, email=None, password=None, **extra_fields):

        if not username:
            raise ValueError("The given username must be set")
        user = self.model(first_name=first_name,
                          last_name=last_name,
                          username=username,
                          email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, first_name=None, last_name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        user = self.create_user(username, first_name, last_name, email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user
