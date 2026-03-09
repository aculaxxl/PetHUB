from rest_framework import serializers
from django.contrib.auth import get_user_model

class RequestCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)

class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)

User = get_user_model()
class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'username']
        read_only_fields = ['id', 'phone_number']