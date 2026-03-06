from django import forms
from .models import Pet

class PetForm(forms.ModelForm):
    class Meta:
        model = Pet
        fields = ['name', 'species', 'birth_date', 'photo']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'species': forms.Select(attrs={'class': 'form-select'}), # Используем Select
            'birth_date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'photo': forms.FileInput(attrs={'class': 'form-control'}),
        }