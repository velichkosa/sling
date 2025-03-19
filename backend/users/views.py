from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action, api_view
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Users
from .serializers import RegisterSerializer, LoginSerializer, TokenSerializer, UserSerializer
from django.contrib.auth import authenticate


class AuthViewSet(ViewSet):
    """
    ViewSet для работы с авторизацией и регистрацией.
    """

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Регистрация нового пользователя."""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Авторизация пользователя и выдача токенов."""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            })
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def refresh(self, request):
        """Обновление токена доступа."""
        serializer = TokenSerializer(data=request.data)
        if serializer.is_valid():
            refresh = RefreshToken(serializer.validated_data['refresh'])
            return Response({
                "access": str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_info(request):
    if request.method == 'GET':
        data = Users.objects.all()
        serializer = UserSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
