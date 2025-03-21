# Generated by Django 4.2.16 on 2024-09-20 05:45

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('service', '0010_remove_maintenance_machine_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MethodsOfRecovery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_of_method', models.CharField(default='', max_length=32, verbose_name='Способ восстановления')),
            ],
            options={
                'verbose_name': 'Способ восстановления',
                'verbose_name_plural': 'Способы восстановления',
            },
        ),
        migrations.CreateModel(
            name='Nodes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_of_node', models.CharField(default='', max_length=32, verbose_name='Название Узла')),
            ],
            options={
                'verbose_name': 'Название Узла',
                'verbose_name_plural': 'Название Узлов',
            },
        ),
        migrations.CreateModel(
            name='Complaints',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_of_refusal', models.DateField(default=datetime.date.today, verbose_name='Дата отказа')),
                ('operating_time_refusal', models.IntegerField(default='', verbose_name='Наработка, м/час')),
                ('description_of_refusal', models.CharField(max_length=128, null=True, verbose_name='Описание отказа')),
                ('spare_parts_used', models.CharField(max_length=128, null=True, verbose_name='Используемые запасные части')),
                ('restoration_date', models.DateField(default=datetime.date.today, verbose_name='Дата восстановления')),
                ('downtime', models.IntegerField(default=0, verbose_name='Время простоя')),
                ('failure_node', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='complaints.nodes', verbose_name='Узел отказа')),
                ('machine', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='service.machine', verbose_name='Зав. № машины')),
                ('method_of_recovery', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='complaints.methodsofrecovery', verbose_name='Способ восстановления')),
                ('service_company_maintenance', models.ForeignKey(default=1, limit_choices_to={'groups__name': 'ServiceCompany'}, on_delete=django.db.models.deletion.CASCADE, related_name='service_companies_complaints', to='service.userdirectory', verbose_name='Сервисная компания')),
            ],
            options={
                'verbose_name': 'Рекламация',
                'verbose_name_plural': 'Рекламации',
            },
        ),
    ]
