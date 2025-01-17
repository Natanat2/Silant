# Generated by Django 4.2.16 on 2024-09-19 07:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='machine',
            name='client',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'Client'}, on_delete=django.db.models.deletion.CASCADE, related_name='machines', to='service.userdirectory'),
        ),
        migrations.AlterField(
            model_name='machine',
            name='service_company',
            field=models.ForeignKey(limit_choices_to={'groups__name': 'ServiceCompany'}, on_delete=django.db.models.deletion.CASCADE, related_name='service_companies', to='service.userdirectory'),
        ),
    ]
