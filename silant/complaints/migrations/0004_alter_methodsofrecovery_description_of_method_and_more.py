# Generated by Django 4.2.16 on 2024-09-20 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0003_alter_methodsofrecovery_description_of_method_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='methodsofrecovery',
            name='description_of_method',
            field=models.CharField(blank=True, default='', max_length=64, null=True, verbose_name='Описание способа восстановления'),
        ),
        migrations.AlterField(
            model_name='nodes',
            name='description_of_node',
            field=models.CharField(blank=True, default='', max_length=64, null=True, verbose_name='Описание Узла'),
        ),
    ]