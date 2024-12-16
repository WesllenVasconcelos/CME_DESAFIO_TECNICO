from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from datetime import datetime
from rest_framework.decorators import action

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class ProcessoListCreateView(generics.ListCreateAPIView):
    queryset = Processo.objects.all()
    serializer_class = ProcessoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        processo = serializer.save()
        processo.material.status = "pendente"
        processo.material.save()


class EtapaListCreateView(generics.ListCreateAPIView):
    queryset = Etapa.objects.all()
    serializer_class = EtapaSerializer
    permission_classes = [IsAuthenticated]


class FalhaListCreateView(generics.ListCreateAPIView):
    queryset = Falha.objects.all()
    serializer_class = FalhaSerializer
    permission_classes = [IsAuthenticated]

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

class FalhasDoProcessoView(ListAPIView):
    serializer_class = FalhaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        processo_id = self.kwargs['processo_id']
        return Falha.objects.filter(etapa__processo_id=processo_id)


class ProcessoDetailView(APIView):
    def get(self, request, processo_id):
        try:
            processo = Processo.objects.get(id=processo_id)
            processo_data = ProcessoSerializer(processo).data

            return Response(processo_data, status=status.HTTP_200_OK)
        except Processo.DoesNotExist:
            return Response({"detail": "Processo não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"Erro interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProcessoEmAndamentoViewSet(viewsets.ViewSet):
    def retrieve(self, request, material_id=None):
        try:
            processo = Processo.objects.filter(material_id=material_id, status='em_andamento').last()
            if processo:
                serializer = ProcessoSerializer(processo)
                return Response(serializer.data)
            else:
                return Response({"detail": "Nenhum processo em andamento encontrado."}, status=404)
        except Processo.DoesNotExist:
            return Response({"detail": "Processo não encontrado."}, status=404)

class SerialProcessosView(ListAPIView):
    serializer_class = ProcessoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        material_id = self.kwargs['material_id']
        return Processo.objects.filter(material_id=material_id)


class CriarEtapaView(APIView):
    def post(self, request, processo_id):
        try:
            processo = Processo.objects.get(id=processo_id)
            nova_etapa = processo.criar_proxima_etapa()
            return Response({
                "message": f"Etapa '{nova_etapa.tipo}' criada com sucesso.",
                "etapa_id": nova_etapa.id
            }, status=status.HTTP_201_CREATED)
        except Processo.DoesNotExist:
            return Response({"detail": "Processo não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Erro interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AtualizarEtapaView(APIView):
    def patch(self, request, etapa_id):
        try:
            etapa = Etapa.objects.get(id=etapa_id)

            if etapa.status == 'completa':
                return Response({"detail": "Etapa já está completa."}, status=status.HTTP_400_BAD_REQUEST)

            etapa.status = 'completa'
            etapa.data_conclusao = datetime.now()
            etapa.save()

            if etapa.tipo == "distribuição":
                processo = Processo.objects.get(id=etapa.processo.id)
                processo.data_conclusao = datetime.now()
                processo.status = "completo"
                processo.save()

            return Response({"message": f"Etapa '{etapa.tipo}' concluída com sucesso."}, status=status.HTTP_200_OK)
        except Etapa.DoesNotExist:
            return Response({"detail": "Etapa não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"Erro interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProcessoEtapasViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['get'], url_path='etapas')
    def listar_etapas(self, request, pk=None):
        try:
            processo = Processo.objects.get(pk=pk)
            etapas = processo.etapas.all()
            serializer = EtapaSerializer(etapas, many=True)
            return Response(serializer.data)
        except Processo.DoesNotExist:
            return Response({"detail": "Processo não encontrado."}, status=404)