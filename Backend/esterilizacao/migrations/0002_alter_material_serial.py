# Generated by Django 5.1.4 on 2024-12-14 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('esterilizacao', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='material',
            name='serial',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
