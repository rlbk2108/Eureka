from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, **extra_fields):

        if not extra_fields['username']:
            raise ValueError("The username must be given")
        user = self.model(first_name=extra_fields['first_name'],
                          last_name=extra_fields['last_name'],
                          username=extra_fields['username'],
                          email=self.normalize_email(extra_fields['email']))
        user.save(using=self._db)

        return user

    def create_superuser(self,  **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("first_name", "Admin{}").format(extra_fields['username'])
        extra_fields.setdefault("last_name", None)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        user = self.create_user(**extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user
