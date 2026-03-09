
from django.contrib import admin
from .models import Profile, Pet, AdoptionRequest

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location')

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'species', 'owner', 'birth_date')
    list_filter = ('species',)

@admin.register(AdoptionRequest)
class PetAdmin(admin.ModelAdmin):
    list_display = ('pet', 'requester', 'status', 'created_at')
    