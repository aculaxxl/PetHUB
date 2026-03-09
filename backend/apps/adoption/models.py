from django.db import models
from apps.profiles.models import Pet, Profile

class AdoptionRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Очікує'),
        ('approved', 'Підтверджено'),
        ('rejected', 'Відхилено'),
    ]
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='adoption_requests')
    requester = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='my_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    db_table = 'profiles_adoptionrequest' 