from django.core.exceptions import ValidationError
from django.db import models
from core.models import User
from datetime import datetime
import random
import string

# Entidade que representa os materias a serem processados

class Material(models.Model):
    nome = models.CharField(max_length=255)
    tipo = models.CharField(max_length=100)
    data_validade = models.DateField()
    serial = models.CharField(max_length=255, unique=True, blank=True, null=True)  # Permitindo que seja vazio inicialmente
    status = models.CharField(max_length=50, choices=[
        ('pendente', 'Pendente de Esterilização'),
        ('recebido', 'Recebido'),
        ('lavado', 'Lavado'),
        ('esterilizado', 'Esterilizado'),
        ('distribuido', 'Distribuído')

    ], default='distribuido')
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def generate_serial(self):
        """
        Gera um número de série único para o equipamento.
        Aqui, vamos gerar um código de 8 caracteres alfanuméricos.
        """
        length = 8
        while True:
            # Gerar um serial único aleatório
            serial = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            # Verificar se o serial já existe no banco de dados
            if not Material.objects.filter(serial=serial).exists():
                return serial

    def save(self, *args, **kwargs):
        if not self.serial:
            # Gerar serial se não houver
            self.serial = self.generate_serial()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.nome} - {self.serial}'


class Processo(models.Model):
    material = models.ForeignKey(Material, related_name='processos', on_delete=models.CASCADE)
    data_inicio = models.DateTimeField()
    data_conclusao = models.DateTimeField(null=True, blank=True)
    tecnico_responsavel = models.ForeignKey(User, related_name='processos', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[
        ('em_andamento', 'Em Andamento'),
        ('completo', 'Completo')
    ], default='em_andamento')

    def __str__(self):
        return f"{self.material.nome} - {self.status}"
    
    def criar_proxima_etapa(self):
        ordem_etapas = ['recebimento', 'lavagem', 'esterilização', 'distribuição']
        etapas_existentes = list(self.etapas.order_by('id').values_list('tipo', flat=True))

        tipo_para_status = {
        'recebimento': 'recebido',
        'lavagem': 'lavado',
        'esterilização': 'esterilizado',
        'distribuição': 'distribuido',
        }

        if not etapas_existentes:
            proxima_etapa_tipo = ordem_etapas[0]
        else:
            ultima_etapa = etapas_existentes[-1]
            if ultima_etapa != ordem_etapas[-1]:
                proxima_etapa_tipo = ordem_etapas[ordem_etapas.index(ultima_etapa) + 1]
            else:
                raise ValidationError("Todas as etapas já foram concluídas para este processo.")

        nova_etapa = Etapa.objects.create(
            processo=self,
            tipo=proxima_etapa_tipo,
            status='em_andamento',
            data_inicio=datetime.now(),
            tecnico_responsavel=self.tecnico_responsavel
        )

        self.material.status = tipo_para_status.get(proxima_etapa_tipo, self.material.status)
        self.material.save()

        return nova_etapa

class Etapa(models.Model):
    processo = models.ForeignKey(Processo, related_name='etapas', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[
        ('completa', 'Completa'),
        ('em_andamento', 'Em Andamento')
    ])
    tipo = models.CharField(max_length=50, choices=[
        ('recebimento', 'Recebimento'),
        ('lavagem', 'Lavagem'),
        ('esterilização', 'Esterilização'),
        ('distribuição', 'Distribuição')
    ])
    data_inicio = models.DateTimeField()
    data_conclusao = models.DateTimeField(null=True, blank=True)
    tecnico_responsavel = models.ForeignKey(User, related_name='etapas', on_delete=models.CASCADE)

    def __str__(self):
        return f"Etapa: {self.tipo} - Processo: {self.processo.id}"

class Falha(models.Model):
    etapa = models.ForeignKey(Etapa, related_name='falhas', on_delete=models.CASCADE)
    tipo_falha = models.CharField(max_length=255)
    descricao = models.TextField()
    data_falha = models.DateTimeField()
    responsavel = models.ForeignKey(User, related_name='falhas', on_delete=models.CASCADE)

    def __str__(self):
        return f"Falha na Etapa {self.etapa.tipo} - Tipo: {self.tipo_falha}"
