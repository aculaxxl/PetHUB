from django.urls import path, include
from . import views
from .views import PetViewSet, ProfileViewSet, ProfileDetailView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pets', PetViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('me/', views.ProfileViewSet.as_view(), name = 'profile-me'),
    path('me/update/', views.ProfileDetailView.as_view(), name = 'profile-me-update'),
]
