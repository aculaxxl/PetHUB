from rest_framework import serializers
from .models import Articles

class NewsSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField(source='author_pet.owner.user.id')
    author_name = serializers.CharField(source='author_pet.name', read_only=True)
    author_photo = serializers.ImageField(source='author_pet.photo', read_only=True)

    class Meta:
        model = Articles
        fields = ['id', 'author_pet', 'owner_id', 'author_name', 'author_photo', 'title', 'anons', 'full_text', 'created_at']
