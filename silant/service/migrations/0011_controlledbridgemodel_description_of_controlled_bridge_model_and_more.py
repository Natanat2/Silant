# Generated by Django 4.2.16 on 2024-09-20 05:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0010_remove_maintenance_machine_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='controlledbridgemodel',
            name='description_of_controlled_bridge_model',
            field=models.CharField(default='', max_length=64, verbose_name='Описание модели управляемого моста'),
        ),
        migrations.AddField(
            model_name='enginemodel',
            name='description_of_engine_model',
            field=models.CharField(default='', max_length=64, verbose_name='Описание модели двигателя'),
        ),
        migrations.AddField(
            model_name='leadbridgemodel',
            name='description_of_lead_bridge_model',
            field=models.CharField(default='', max_length=64, verbose_name='Описание модели ведущего моста'),
        ),
        migrations.AddField(
            model_name='machinemodel',
            name='description_of_machine_model',
            field=models.CharField(default='', max_length=64, verbose_name='Описание модели техники'),
        ),
        migrations.AddField(
            model_name='transmissionmodel',
            name='description_of_transmission_model',
            field=models.CharField(default='', max_length=64, verbose_name='Описание модели трансмиссии'),
        ),
    ]
