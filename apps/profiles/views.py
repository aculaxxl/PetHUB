from rest_framework import viewsets, permissions
from .models import Pet
from .serializers import PetSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Автоматически привязываем питомца к профилю текущего юзера
        serializer.save(owner=self.request.user.profile)