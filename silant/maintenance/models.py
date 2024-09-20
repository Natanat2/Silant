from django.db import models
from service.models import Machine, UserDirectory
import datetime


class TypeOfMaintenance(models.Model):
    type_of_maintenance_name = models.CharField(max_length = 16, verbose_name = 'Вид ТО')
    description_of_type_of_maintenance = models.CharField(max_length = 64, verbose_name = 'Описание вида ТО',
                                                          default = '', blank=True, null=True)

    class Meta:
        verbose_name = 'Вид ТО'
        verbose_name_plural = 'Виды ТО'

    def __str__(self):
        return self.type_of_maintenance_name


class OrganizationCarriedMaintenance(models.Model):
    name_organization = models.CharField(max_length = 32, verbose_name = 'Организация, проводившая ТО')
    description_of_organization = models.CharField(max_length = 64, verbose_name = 'Описание организации',
                                                   default = '', blank=True, null=True)

    class Meta:
        verbose_name = 'Организация, проводившая ТО'
        verbose_name_plural = 'Организации, проводившие ТО'

    def __str__(self):
        return self.name_organization


class Maintenance(models.Model):
    machine = models.ForeignKey(Machine, on_delete = models.CASCADE, verbose_name = 'Зав. № машины', null = True)
    type_of_maintenance = models.ForeignKey(TypeOfMaintenance, on_delete = models.CASCADE, verbose_name = 'Вид ТО')
    date_of_maintenance = models.DateField(verbose_name = 'Дата проведения ТО')
    operating_time = models.IntegerField(default = '', verbose_name = 'Наработка, м/час')
    order_number = models.CharField(max_length = 32, verbose_name = '№ заказ-наряда', default = '')
    order_date = models.DateField(verbose_name = 'Дата заказ-наряда', default = datetime.date.today)
    organization_carried_maintenance = models.ForeignKey(OrganizationCarriedMaintenance, on_delete = models.CASCADE,
                                                         verbose_name = 'Организация, проводившая ТО', default = 1)
    service_company_maintenance = models.ForeignKey(
        UserDirectory,
        on_delete = models.CASCADE,
        related_name = 'service_companies_maintenance', verbose_name = 'Сервисная компания',
        limit_choices_to = {'groups__name': 'ServiceCompany'}, default = 1
    )

    class Meta:
        verbose_name = 'Техническое обслуживание'
        verbose_name_plural = 'Технические обслуживания'

    def __str__(self):
        return self.order_number
