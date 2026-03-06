import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RequestCodeSerializer, VerifyCodeSerializer
from drf_spectacular.utils import extend_schema  

User = get_user_model()

class RequestCodeView(APIView):
    @extend_schema(request=RequestCodeSerializer)  
    def post(self, request):
        serializer = RequestCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            code = str(random.randint(1000, 9999)) 
            print(f'\nSMS >>> Code {code} for phone {phone}\n')
            return Response({"detail": "Код відправлено в термінал"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyCodeView(APIView):
    @extend_schema(request=VerifyCodeSerializer) 
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            code = serializer.validated_data['code']
            
           
            if code == '1234':
                user, created = User.objects.get_or_create(phone=phone)

                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh), 
                    "is_new_user": created,
                    "detail": "Успішний вхід"
                }, status=status.HTTP_200_OK)
            
            return Response({"detail":"Невірний код"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
