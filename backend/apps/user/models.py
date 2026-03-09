
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Номер телефону обов'язковий")
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone_number, password, **extra_fields)

class User(AbstractUser):
    username = None  
    phone_number = models.CharField(max_length=15, unique=True, verbose_name="Номер телефону")
    
    USERNAME_FIELD = 'phone_number' 
    REQUIRED_FIELDS = [] 

    objects = UserManager()

    def __str__(self):
        return self.phone_number
    
class SMSCode(models.Model):
    phone = models.CharField(max_length=15, verbose_name="Номер телефону")
    code = models.CharField(max_length=6, verbose_name="Код підтвердження")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення")

    class Meta:
        verbose_name = "SMS код"
        verbose_name_plural = "SMS коди"

    def __str__(self):
        return f"Код {self.code} для {self.phone}"