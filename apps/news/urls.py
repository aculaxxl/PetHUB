from django.urls import path, include
from . import views
from .views import NewsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'news', NewsViewSet)




urlpatterns = [
    path('api/', include(router.urls)),
]
