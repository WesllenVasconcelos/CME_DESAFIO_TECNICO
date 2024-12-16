from rest_framework import serializers
from rest_framework import viewsets
from rest_framework.response import Response
from .models import *
from core.models import User
from core.serializers import UserSerializer


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'nome', 'tipo', 'data_validade', 'serial', 'status', 'data_cadastro']


class EtapaSerializer(serializers.ModelSerializer):
    tecnico_responsavel = UserSerializer(read_only=True)
    tecnico_responsavel_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name='Técnico'),
        source='tecnico_responsavel',
        write_only=True
    )

    class Meta:
        model = Etapa
        fields = ['id', 'processo', 'status', 'data_inicio', 'data_conclusao', 
                'tecnico_responsavel', 'tecnico_responsavel_id', 'tipo']


class ProcessoSerializer(serializers.ModelSerializer):
    etapa_atual = serializers.SerializerMethodField()
    tecnico_responsavel = UserSerializer(read_only=True)
    tecnico_responsavel_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='tecnico_responsavel',
        write_only=True
    )
    
    material = MaterialSerializer(read_only=True)
    material_id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source='material',
        write_only=True
    )
    serial = serializers.CharField(source='material.serial', read_only=True)

    class Meta:
        model = Processo
        fields = ['id', 'material', 'material_id', 'serial', 'data_inicio', 'data_conclusao', 'status', 'etapa_atual', 'tecnico_responsavel_id', 'tecnico_responsavel']
    
    def get_etapa_atual(self, obj):

        ultima_etapa = obj.etapas.order_by('-data_inicio').first()
        if ultima_etapa:
            return {
                "id": ultima_etapa.id,
                "tipo": ultima_etapa.tipo,
                "status": ultima_etapa.status,
                "data_inicio": ultima_etapa.data_inicio,
                "data_conclusao": ultima_etapa.data_conclusao,
                "tecnico_responsavel": ultima_etapa.tecnico_responsavel.username
            }
        return None


class ListEtapaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etapa
        fields = ['tipo']


class FalhaSerializer(serializers.ModelSerializer):
    responsavel = UserSerializer(read_only=True)
    etapa_tipo = serializers.CharField(source='etapa.tipo',read_only=True)
    tecnico_responsavel_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='responsavel',
        write_only=True
    )

    class Meta:
        model = Falha
        fields = ['id', 'etapa', 'etapa_tipo', 'tipo_falha', 'descricao', 'data_falha', 
                'responsavel', 'tecnico_responsavel_id']
