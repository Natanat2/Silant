# Generated by Django 4.2.16 on 2024-09-20 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maintenance', '0005_alter_maintenance_operating_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='maintenance',
            name='operating_time',
            field=models.PositiveIntegerField(verbose_name='Наработка, м/час'),
        ),
    ]
