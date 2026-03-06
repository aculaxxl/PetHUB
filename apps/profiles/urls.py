from django.urls import path, include
from . import views
from .views import PetViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
