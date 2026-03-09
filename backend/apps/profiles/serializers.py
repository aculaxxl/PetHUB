from rest_framework import serializers
from .models import Pet, Profile, AdoptionRequest
from drf_spectacular.utils import extend_schema_field 

class PetSerializer(serializers.ModelSerializer):
    species_display = serializers.CharField(source='get_species_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    owner_location = serializers.CharField(source='owner.location', read_only=True)
    owner_phone = serializers.SerializerMethodField()
    
    class Meta:
        model = Pet
        fields = [
            'id', 'owner', 'name', 'species', 'species_display', 
            'birth_date', 'photo', 'status', 'status_display', 
            'old_owners', 'owner_location', 'owner_phone'
        ]
        read_only_fields = ['owner', 'old_owners']

    @extend_schema_field(serializers.CharField())
    def get_owner_phone(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return "Увійдіть для перегляду"


        if obj.owner.user == request.user:
            return obj.owner.user.phone_number

        is_approved = AdoptionRequest.objects.filter(
            pet=obj, 
            requester=request.user.profile, 
            status='approved'
        ).exists()

        if is_approved:
            return obj.owner.user.phone_number
            
        return "Номер буде доступний після підтвердження"
class AdoptionRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.name', read_only=True)
    requester_phone = serializers.SerializerMethodField() 
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    owner_phone = serializers.SerializerMethodField()

    class Meta:
        model = AdoptionRequest
        fields = ['id', 'pet', 'pet_name', 'requester', 'requester_name', 'requester_phone', 'owner_phone', 'status']
        read_only_fields = ['requester']

    def get_requester_phone(self, obj):
        if obj.status == 'approved':
            return obj.requester.user.phone_number
        return "Буде доступно після схвалення"
    def get_owner_phone(self, obj):
        if obj.status == 'approved':
            return obj.pet.owner.user.phone_number
        return "Буде доступно після схвалення"

class ProfileSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, read_only=True)
    past_pets = PetSerializer(many=True, read_only=True) 
    incoming_requests = serializers.SerializerMethodField()
    my_sent_requests = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'name', 'bio', 'location', 'pets', 'past_pets', 'incoming_requests', 'my_sent_requests']
        read_only_fields = ['id', 'owner', 'past_pets']

    @extend_schema_field(serializers.ListSerializer(child=serializers.DictField()))
    def get_incoming_requests(self, obj):
        requests = AdoptionRequest.objects.filter(pet__owner=obj, status__in=['pending', 'approved', 'rejected'])
        return AdoptionRequestSerializer(requests, many=True).data
    @extend_schema_field(AdoptionRequestSerializer(many=True))
    def get_my_sent_requests(self, obj):
        requests = AdoptionRequest.objects.filter(requester=obj).order_by('-created_at')
        return AdoptionRequestSerializer(requests, many=True).data

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'bio', 'location']

class TransferPetSerializer(serializers.Serializer):
    new_owner_id = serializers.IntegerField(help_text="ID профілю нового власника")

