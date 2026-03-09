from rest_framework import viewsets, permissions, generics
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pet, Profile
from .serializers import PetSerializer, ProfileSerializer, ProfileUpdateSerializer, TransferPetSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    @extend_schema(request=TransferPetSerializer)
    @action(detail=True, methods=['post'])
    def transfer_ownership(self, request, pk=None):
        pet = self.get_object()
        serializer = TransferPetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_owner_id = serializer.validated_data['new_owner_id']
    
        try:
            new_owner = Profile.objects.get(id=new_owner_id)
        except Profile.DoesNotExist:
            return Response({"error": "Такого профілю не існує"}, status=404)

        pet.old_owners.add(pet.owner) 
        pet.owner = new_owner    
        pet.status = 'active' 
        pet.save()

        return Response({
            "message": f"Тваринку {pet.name} успішно передано власнику {new_owner.name}! Тепер вона активна в його профілі."
        })


class ProfileViewSet(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    
class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    def get_object(self):
        return Profile.objects.get(user=self.request.user)