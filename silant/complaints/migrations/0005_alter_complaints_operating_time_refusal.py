# Generated by Django 4.2.16 on 2024-09-20 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0004_alter_methodsofrecovery_description_of_method_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaints',
            name='operating_time_refusal',
            field=models.PositiveIntegerField(default=0, verbose_name='Наработка, м/час'),
        ),
    ]
