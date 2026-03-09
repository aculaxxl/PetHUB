from rest_framework import serializers
from .models import AdoptionRequest

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