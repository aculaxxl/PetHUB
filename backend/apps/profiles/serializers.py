from rest_framework import serializers
from .models import Pet, Profile

class PetSerializer(serializers.ModelSerializer):
    species_display = serializers.CharField(source='get_species_display', read_only=True)
    
    class Meta:
        model = Pet
        fields = ['id', 'owner', 'name', 'species', 'species_display', 'birth_date', 'photo']
        read_only_fields = ['owner']

class ProfileSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, read_only=True) 

    class Meta:
        model = Profile
        fields = ['id', 'name', 'bio', 'location', 'pets']
        read_only_fields = ['id', 'owner']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'bio', 'location'] 
     
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)