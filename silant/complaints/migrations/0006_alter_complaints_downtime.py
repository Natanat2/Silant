# Generated by Django 4.2.16 on 2024-09-20 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0005_alter_complaints_operating_time_refusal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaints',
            name='downtime',
            field=models.IntegerField(editable=False, verbose_name='Время простоя'),
        ),
    ]