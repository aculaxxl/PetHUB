from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    name = name = models.CharField(max_length=50, blank=True, verbose_name="Ім'я")
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"User{self.user.id}"
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Профіль: {self.user.phone_number}"
    
class Pet(models.Model):
    SPECIES_CHOICES = [
        ('dog', 'Собака'),
        ('cat', 'Кіт'),
        ('parrot', 'Папуга'),
        ('hamster', 'Хомʼяк'),
        ('rabbit', 'Кролик'),
        ('other', 'Інше'),
    ]
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100, verbose_name="Ім'я тваринки")
    species = models.CharField(
        max_length=20, 
        choices=SPECIES_CHOICES, 
        default='dog', 
        verbose_name="Вид"
    )
    birth_date = models.DateField(verbose_name="Дата народження")
    photo = models.ImageField(upload_to='pets_photos/', default='default_pet.jpg')

    def __str__(self):
        return f"{self.name} ({self.get_species_display()})"