# Generated by Django 4.2.16 on 2024-09-20 05:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0009_alter_complaints_options'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='maintenance',
            name='machine',
        ),
        migrations.RemoveField(
            model_name='maintenance',
            name='organization_carried_maintenance',
        ),
        migrations.RemoveField(
            model_name='maintenance',
            name='service_company_maintenance',
        ),
        migrations.RemoveField(
            model_name='maintenance',
            name='type_of_maintenance',
        ),
        migrations.DeleteModel(
            name='Complaints',
        ),
        migrations.DeleteModel(
            name='Maintenance',
        ),
        migrations.DeleteModel(
            name='MethodsOfRecovery',
        ),
        migrations.DeleteModel(
            name='Nodes',
        ),
        migrations.DeleteModel(
            name='OrganizationCarriedMaintenance',
        ),
        migrations.DeleteModel(
            name='TypeOfMaintenance',
        ),
    ]
