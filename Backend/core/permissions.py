from rest_framework.permissions import BasePermission

class IsTecnico(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'TECNICO'

class IsEnfermagem(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ENFERMAGEM'

class IsAdministrativo(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ADMINISTRATIVO'
