from rest_framework import serializers
from .models import Pet, Profile

class PetSerializer(serializers.ModelSerializer):
    species_display = serializers.CharField(source='get_species_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Pet
        fields = ['id', 'owner', 'name', 'species', 'species_display', 'birth_date', 'photo', 'status', 'status_display', 'old_owners']
        read_only_fields = ['owner', 'old_owners']

class ProfileSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, read_only=True)
    past_pets = PetSerializer(many=True, read_only=True) 

    class Meta:
        model = Profile
        fields = ['id', 'name', 'bio', 'location', 'pets', 'past_pets']
        read_only_fields = ['id', 'owner', 'past_pets']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'bio', 'location'] 
     
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class TransferPetSerializer(serializers.Serializer):
    new_owner_id = serializers.IntegerField(help_text="ID профілю нового власника")
