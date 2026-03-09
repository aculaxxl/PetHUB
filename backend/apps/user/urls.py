from django.urls import path
from . import views
from .views import RequestCodeView, VerifyCodeView, UserMeView
urlpatterns = [
    path('request-code/', views.RequestCodeView.as_view(),name='request_code'),
    path('verify-code/', views.VerifyCodeView.as_view(), name='verify_code'),
    path('me/', views.UserMeView.as_view(), name = 'me')
]