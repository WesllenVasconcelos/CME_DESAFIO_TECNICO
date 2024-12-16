from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'materiais', MaterialViewSet, basename='material')
router.register(r'processos', ProcessoEtapasViewSet, basename='processo')

urlpatterns = [
    path('processos/', ProcessoListCreateView.as_view(), name='processo-list-create'),
    path('materiais/<int:material_id>/processo', ProcessoEmAndamentoViewSet.as_view({'get': 'retrieve'}), name='processo-em-andamento'),
    path('materiais/<int:material_id>/processos', SerialProcessosView.as_view(), name='material-processos'),
    path('processos/<str:processo_id>/', ProcessoDetailView.as_view(), name='processo-detail'),
    path('etapas/', EtapaListCreateView.as_view(), name='etapa-list-create'),
    path('falhas/', FalhaListCreateView.as_view(), name='falha-list-create'),
    path('processos/<int:processo_id>/falhas/', FalhasDoProcessoView.as_view(), name='falhas-do-processo'),
    path('processos/<int:processo_id>/criar-etapa/', CriarEtapaView.as_view(), name='criar-etapa'),
    path('etapas/<int:etapa_id>/atualizar-status/', AtualizarEtapaView.as_view(), name='atualizar-etapa'),
    path('', include(router.urls)),
]

