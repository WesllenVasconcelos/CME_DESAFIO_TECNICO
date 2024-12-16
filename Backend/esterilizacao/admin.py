from django.contrib import admin
from .models import *

class MaterialAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'data_validade', 'serial', 'status', 'data_cadastro')
    list_filter = ('status', 'tipo')
    search_fields = ('nome', 'serial')

class ProcessoAdmin(admin.ModelAdmin):
    list_display = ('material', 'data_inicio', 'data_conclusao', 'tecnico_responsavel', 'status')
    list_filter = ('status',)
    search_fields = ('material__nome', 'tecnico_responsavel__username')

class EtapaAdmin(admin.ModelAdmin):
    list_display = ('processo', 'tecnico_responsavel', 'status', 'data_inicio', 'data_conclusao')
    list_filter = ('status', 'processo__status')
    search_fields = ('processo__material__nome', 'tecnico_responsavel__username')

class FalhaAdmin(admin.ModelAdmin):
    list_display = ('etapa', 'tipo_falha', 'descricao', 'data_falha', 'responsavel')
    list_filter = ('tipo_falha', 'etapa__status')
    search_fields = ('responsavel__username',)

admin.site.register(Material, MaterialAdmin)
admin.site.register(Processo, ProcessoAdmin)
admin.site.register(Etapa, EtapaAdmin)
admin.site.register(Falha, FalhaAdmin)
