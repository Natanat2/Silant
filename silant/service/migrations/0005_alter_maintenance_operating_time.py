# Generated by Django 4.2.16 on 2024-09-19 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0004_organizationcarriedmaintenance_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='maintenance',
            name='operating_time',
            field=models.IntegerField(default='', verbose_name='Наработка, м/час'),
        ),
    ]
