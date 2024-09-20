from django.db import models
from service.models import Machine, UserDirectory
import datetime


class Nodes(models.Model):
    name_of_node = models.CharField(max_length = 32, verbose_name = 'Название Узла', default = '')
    description_of_node = models.CharField(max_length = 64, verbose_name = 'Описание Узла', default = '', blank = True,
                                           null = True)

    class Meta:
        verbose_name = 'Название Узла'
        verbose_name_plural = 'Название Узлов'

    def __str__(self):
        return self.name_of_node


class MethodsOfRecovery(models.Model):
    name_of_method = models.CharField(max_length = 32, verbose_name = 'Способ восстановления', default = '')
    description_of_method = models.CharField(max_length = 64, verbose_name = 'Описание способа восстановления',
                                             default = '', blank = True, null = True)

    class Meta:
        verbose_name = 'Способ восстановления'
        verbose_name_plural = 'Способы восстановления'

    def __str__(self):
        return self.name_of_method


class Complaints(models.Model):
    machine = models.ForeignKey(Machine, on_delete = models.CASCADE, verbose_name = 'Зав. № машины', null = True)
    date_of_refusal = models.DateField(verbose_name = 'Дата отказа')
    operating_time_refusal = models.PositiveIntegerField(verbose_name = 'Наработка, м/час')
    failure_node = models.ForeignKey(Nodes, on_delete = models.CASCADE, verbose_name = 'Узел отказа', null = True)
    description_of_refusal = models.CharField(max_length = 128, verbose_name = 'Описание отказа', null = True)
    method_of_recovery = models.ForeignKey(MethodsOfRecovery, on_delete = models.CASCADE,
                                           verbose_name = 'Способ восстановления', null = True)
    spare_parts_used = models.CharField(max_length = 128, verbose_name = 'Используемые запасные части', blank = True,
                                        null = True)
    restoration_date = models.DateField(verbose_name = 'Дата восстановления', default = datetime.date.today)
    downtime = models.IntegerField(verbose_name = 'Время простоя', editable = False)
    service_company_maintenance = models.ForeignKey(
        UserDirectory,
        on_delete = models.CASCADE,
        related_name = 'service_companies_complaints', verbose_name = 'Сервисная компания',
        limit_choices_to = {'groups__name': 'ServiceCompany'}, default = 1
    )

    def save(self, *args, **kwargs):
        if self.restoration_date and self.date_of_refusal:
            self.downtime = (self.restoration_date - self.date_of_refusal).days
        else:
            self.downtime = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.date_of_refusal.strftime('%Y-%m-%d')

    class Meta:
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'
