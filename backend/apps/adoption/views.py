from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import AdoptionRequestSerializer
from .models import AdoptionRequest

class AdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user.profile)

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user.profile != instance.pet.owner:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Тільки власник тваринки може підтвердити заявку!")
        
        serializer.save()
