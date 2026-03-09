from django.urls import path, include
from . import views
from .views import PetViewSet, ProfileViewSet, ProfileDetailView, AdoptionRequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pets', PetViewSet)
router.register(r'adoption-requests', AdoptionRequestViewSet) 

urlpatterns = [
    path('', include(router.urls)),
    path('me/', views.ProfileViewSet.as_view(), name = 'profile-me'),
    path('me/update/', views.ProfileDetailView.as_view(), name = 'profile-me-update'),
]
