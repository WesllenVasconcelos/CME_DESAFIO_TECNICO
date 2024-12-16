from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True, db_index=True)

    CARGO_CHOICES = [
        ('TECNICO', 'Técnico'),
        ('ENFERMAGEM', 'Enfermagem'),
        ('ADMINISTRATIVO', 'Administrativo'),
    ]
    cargo = models.CharField(max_length=20, choices=CARGO_CHOICES, default='TECNICO')

    def clean(self):
        if len(self.username) < 5:
            raise ValidationError({'username': "O nome de usuário deve ter pelo menos 5 caracteres."})

    def __str__(self):
        return self.username

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return{
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        }