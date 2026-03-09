from django import forms
from .models import Articles
from apps.profiles.models import Pet
from django.forms import ModelForm, TextInput, Textarea, DateTimeField, Select


class ArticlesForm(ModelForm):
    class Meta:
        model = Articles
        fields = ['author_pet', 'title', 'anons', 'full_text']

        widgets = {
            'author_pet': Select(attrs={
                'class': 'form-select', 
            }),
            'title': TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Назва статті'
            }),
            'anons': TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Анонс статті'
            }),
            'full_text': Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Текст статті'
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        
        if user:
            self.fields['author_pet'].queryset = Pet.objects.filter(owner__user=user)
            self.fields['author_pet'].empty_label = "Оберіть, хто публікує новину"