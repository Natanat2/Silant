from django.db import models
from django.contrib.auth.models import User, Group


class UserDirectory(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, verbose_name = 'Пользователь')
    groups = models.ManyToManyField(Group, related_name = 'user_directories', blank = True, verbose_name = 'Группы')

    class Meta:
        verbose_name = 'Справочник пользователей'
        verbose_name_plural = 'Справочники пользователей'

    def __str__(self):
        return self.user.first_name


class MachineModel(models.Model):
    machine_model_name = models.CharField(max_length = 16, verbose_name = 'Модель техники')

    class Meta:
        verbose_name = 'Модель техники'
        verbose_name_plural = 'Модели техники'

    def __str__(self):
        return self.machine_model_name


class EngineModel(models.Model):
    engine_model_name = models.CharField(max_length = 16, verbose_name = 'Модель двигателя')

    class Meta:
        verbose_name = 'Модель двигателя'
        verbose_name_plural = 'Модели двигателей'

    def __str__(self):
        return self.engine_model_name


class TransmissionModel(models.Model):
    transmission_model_name = models.CharField(max_length = 16, verbose_name = 'Модель трансмиссии')

    class Meta:
        verbose_name = 'Модель трансмиссии'
        verbose_name_plural = 'Модели трансмиссий'

    def __str__(self):
        return self.transmission_model_name


class LeadBridgeModel(models.Model):
    lead_bridge_model_name = models.CharField(max_length = 16, verbose_name = 'Модель ведущего моста')

    class Meta:
        verbose_name = 'Модель ведущего моста'
        verbose_name_plural = 'Модели ведущих мостов'

    def __str__(self):
        return self.lead_bridge_model_name


class ControlledBridgeModel(models.Model):
    controlled_bridge_model_name = models.CharField(max_length = 16, verbose_name = 'Модель управляемого моста')

    class Meta:
        verbose_name = 'Модель управляемого моста'
        verbose_name_plural = 'Модели управляемых мостов'

    def __str__(self):
        return self.controlled_bridge_model_name


class Machine(models.Model):
    machine_factory_number = models.CharField(max_length = 16, unique = True, verbose_name = 'Зав. № машины')
    machine_model = models.ForeignKey(MachineModel, on_delete = models.CASCADE, verbose_name = 'Модель техники')
    engine_model = models.ForeignKey(EngineModel, on_delete = models.CASCADE, verbose_name = 'Модель двигателя')
    engine_factory_number = models.CharField(max_length = 16, verbose_name = 'Зав. № двигателя')
    transmission_model = models.ForeignKey(TransmissionModel, on_delete = models.CASCADE,
                                           verbose_name = 'Модель трансмиссии')
    transmission_factory_number = models.CharField(max_length = 16, verbose_name = 'Зав. № трансмиссии')
    lead_bridge_model = models.ForeignKey(LeadBridgeModel, on_delete = models.CASCADE,
                                          verbose_name = 'Модель ведущего моста')
    lead_bridge_factory_number = models.CharField(max_length = 16, verbose_name = 'Зав. № ведущего моста')
    controlled_bridge_model = models.ForeignKey(ControlledBridgeModel, on_delete = models.CASCADE,
                                                verbose_name = 'Модель управляемого моста')
    controlled_bridge_factory_number = models.CharField(max_length = 16, verbose_name = 'Зав. № управляемого моста')
    supply_contract_number_date = models.CharField(max_length = 16, verbose_name = 'Договор поставки №, дата',
                                                   null = True)
    date_shipment_from_factory = models.DateField(verbose_name = 'Дата отгрузки с завода')
    consumer = models.CharField(max_length = 32, verbose_name = 'Грузополучатель')
    delivery_address = models.CharField(max_length = 64, verbose_name = 'Адрес поставки')
    configuration = models.TextField(max_length = 1024, verbose_name = 'Комплектация')
    client = models.ForeignKey(
        UserDirectory,
        on_delete = models.CASCADE,
        related_name = 'machines', verbose_name = 'Клиент',
        limit_choices_to = {'groups__name': 'Client'}
    )

    service_company = models.ForeignKey(
        UserDirectory,
        on_delete = models.CASCADE,
        related_name = 'service_companies', verbose_name = 'Сервисная компания',
        limit_choices_to = {'groups__name': 'ServiceCompany'}
    )

    class Meta:
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'

    def __str__(self):
        return self.machine_factory_number


class TypeOfMaintenance(models.Model):
    type_of_maintenance_name = models.CharField(max_length = 16, verbose_name = 'Вид ТО')

    class Meta:
        verbose_name = 'Вид ТО'
        verbose_name_plural = 'Виды ТО'

    def __str__(self):
        return self.type_of_maintenance_name


class Maintenance(models.Model):
    type_of_maintenance = models.ForeignKey(TypeOfMaintenance, on_delete = models.CASCADE, verbose_name = 'Вид ТО')
    date_of_maintenance = models.DateField(verbose_name = 'Дата проведения ТО')

    class Meta:
        verbose_name = 'Техническое обслуживание'
        verbose_name_plural = 'Технические обслуживания'

    def __str__(self):
        return f'{self.type_of_maintenance} - {self.date_of_maintenance}'
