import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RequestCodeSerializer, VerifyCodeSerializer, UserMeSerializer
from drf_spectacular.utils import extend_schema  
from django.core.cache import cache

User = get_user_model()

class RequestCodeView(APIView):
    @extend_schema(request=RequestCodeSerializer)  
    def post(self, request):
        serializer = RequestCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            code = str(random.randint(1000, 9999)) 
            cache.set(f'auth_code_{phone}', code, timeout=300)
            print(f'\nSMS >>> Code {code} for phone {phone}\n', flush=True)
            return Response({"detail": "Код відправлено в термінал"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyCodeView(APIView):
    @extend_schema(request=VerifyCodeSerializer) 
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            code = serializer.validated_data['code']
            saved_code = cache.get(f'auth_code_{phone}')
           
            if saved_code and saved_code == code:
                user, created = User.objects.get_or_create(phone_number=phone)

                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh), 
                    "is_new_user": created,
                    "detail": "Успішний вхід"
                }, status=status.HTTP_200_OK)
            
            return Response({"detail":"Невірний код"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user