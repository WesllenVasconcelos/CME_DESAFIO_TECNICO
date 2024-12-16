from rest_framework import generics,status,views,permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from core.permissions import IsTecnico, IsEnfermagem, IsAdministrativo
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import *

# Create your views here.

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = []

    def post(self,request):
        if User.objects.count() > 0:  # Verifica se já existe algum usuário
            self.permission_classes = [IsAdministrativo]
        user=request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        return Response(user_data, status=status.HTTP_201_CREATED)

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def cargo_options(request):
    return Response([
        {'value': 'TECNICO', 'label': 'Técnico'},
        {'value': 'ENFERMAGEM', 'label': 'Enfermagem'},
        {'value': 'ADMINISTRATIVO', 'label': 'Administrativo'}
    ])

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer