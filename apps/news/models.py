from django.db import models
from apps.profiles.models import Pet

class Articles(models.Model):
    author_pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='news', verbose_name="Автор (тваринка)")
    title = models.CharField('Назва новини', max_length=100)
    anons = models.CharField('Анонс', max_length=250)
    full_text = models.TextField('Новина')
    created_at = models.DateTimeField('Дата публікації', auto_now_add=True)

    def __str__(self):
        return f'Новина {self.title}: {self.author_pet.name}'
    
    def get_absolute_url(self):
        return f'/news/{self.id}'
    
    
    class Meta:
        verbose_name='Новини'
        verbose_name_plural = 'Новини'