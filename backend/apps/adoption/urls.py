from django.urls import path, include
from . import views
from .views import AdoptionRequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'adoption-requests', AdoptionRequestViewSet) 

urlpatterns = [
    path('', include(router.urls)),
]