# Generated by Django 4.2.16 on 2024-09-19 10:04

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('service', '0003_typeofmaintenance_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrganizationCarriedMaintenance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_organization', models.CharField(max_length=32, verbose_name='Организация, проводившая ТО')),
            ],
            options={
                'verbose_name': 'Организация, проводившая ТО',
                'verbose_name_plural': 'Организации, проводившие ТО',
            },
        ),
        migrations.AlterModelOptions(
            name='controlledbridgemodel',
            options={'verbose_name': 'Модель управляемого моста', 'verbose_name_plural': 'Модели управляемых мостов'},
        ),
        migrations.AlterModelOptions(
            name='enginemodel',
            options={'verbose_name': 'Модель двигателя', 'verbose_name_plural': 'Модели двигателей'},
        ),
        migrations.AlterModelOptions(
            name='leadbridgemodel',
            options={'verbose_name': 'Модель ведущего моста', 'verbose_name_plural': 'Модели ведущих мостов'},
        ),
        migrations.AlterModelOptions(
            name='machine',
            options={'verbose_name': 'Машина', 'verbose_name_plural': 'Машины'},
        ),
        migrations.AlterModelOptions(
            name='machinemodel',
            options={'verbose_name': 'Модель техники', 'verbose_name_plural': 'Модели техники'},
        ),
        migrations.AlterModelOptions(
            name='maintenance',
            options={'verbose_name': 'Техническое обслуживание', 'verbose_name_plural': 'Технические обслуживания'},
        ),
        migrations.AlterModelOptions(
            name='transmissionmodel',
            options={'verbose_name': 'Модель трансмиссии', 'verbose_name_plural': 'Модели трансмиссий'},
        ),
        migrations.AlterModelOptions(
            name='typeofmaintenance',
            options={'verbose_name': 'Вид ТО', 'verbose_name_plural': 'Виды ТО'},
        ),
        migrations.AlterModelOptions(
            name='userdirectory',
            options={'verbose_name': 'Справочник пользователей', 'verbose_name_plural': 'Справочники пользователей'},
        ),
        migrations.AddField(
            model_name='maintenance',
            name='machine',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='service.machine', verbose_name='Машина'),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='operating_time',
            field=models.IntegerField(default=0, verbose_name='Наработка, м/час'),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='order_date',
            field=models.DateField(default=datetime.date.today, verbose_name='Дата заказ-наряда'),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='order_number',
            field=models.CharField(default=0, max_length=32, verbose_name='№ заказ-наряда'),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='service_company_maintenance',
            field=models.ForeignKey(default=1, limit_choices_to={'groups__name': 'ServiceCompany'}, on_delete=django.db.models.deletion.CASCADE, related_name='service_companies_maintenance', to='service.userdirectory', verbose_name='Сервисная компания'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='client',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'Client'}, on_delete=django.db.models.deletion.CASCADE, related_name='machines', to='service.userdirectory', verbose_name='Клиент'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='configuration',
            field=models.TextField(max_length=1024, verbose_name='Комплектация'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='consumer',
            field=models.CharField(max_length=32, verbose_name='Грузополучатель'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='controlled_bridge_factory_number',
            field=models.CharField(max_length=16, verbose_name='Зав. № управляемого моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='controlled_bridge_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.controlledbridgemodel', verbose_name='Модель управляемого моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='date_shipment_from_factory',
            field=models.DateField(verbose_name='Дата отгрузки с завода'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='delivery_address',
            field=models.CharField(max_length=64, verbose_name='Адрес поставки'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='engine_factory_number',
            field=models.CharField(max_length=16, verbose_name='Зав. № двигателя'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='engine_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.enginemodel', verbose_name='Модель двигателя'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='lead_bridge_factory_number',
            field=models.CharField(max_length=16, verbose_name='Зав. № ведущего моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='lead_bridge_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.leadbridgemodel', verbose_name='Модель ведущего моста'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='machine_factory_number',
            field=models.CharField(max_length=16, unique=True, verbose_name='Зав. № машины'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='machine_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.machinemodel', verbose_name='Модель техники'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='service_company',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'ServiceCompany'}, on_delete=django.db.models.deletion.CASCADE, related_name='service_companies_machine', to='service.userdirectory', verbose_name='Сервисная компания'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='supply_contract_number_date',
            field=models.CharField(max_length=16, null=True, verbose_name='Договор поставки №, дата'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='transmission_factory_number',
            field=models.CharField(max_length=16, verbose_name='Зав. № трансмиссии'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='transmission_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.transmissionmodel', verbose_name='Модель трансмиссии'),
        ),
        migrations.AlterField(
            model_name='maintenance',
            name='date_of_maintenance',
            field=models.DateField(verbose_name='Дата проведения ТО'),
        ),
        migrations.AlterField(
            model_name='maintenance',
            name='type_of_maintenance',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='service.typeofmaintenance', verbose_name='Вид ТО'),
        ),
        migrations.AlterField(
            model_name='typeofmaintenance',
            name='type_of_maintenance_name',
            field=models.CharField(max_length=16, verbose_name='Вид ТО'),
        ),
        migrations.AlterField(
            model_name='userdirectory',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='user_directories', to='auth.group', verbose_name='Группы'),
        ),
        migrations.AlterField(
            model_name='userdirectory',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='organization_carried_maintenance',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='service.organizationcarriedmaintenance', verbose_name='Организация, проводившая ТО'),
        ),
    ]
