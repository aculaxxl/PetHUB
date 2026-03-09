from rest_framework import viewsets, permissions, generics
from .models import Pet, Profile
from .serializers import PetSerializer, ProfileSerializer, ProfileUpdateSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class ProfileViewSet(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    
class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    def get_object(self):
        return Profile.objects.get(user=self.request.user)