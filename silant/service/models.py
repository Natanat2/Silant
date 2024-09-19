from django.db import models
from django.contrib.auth.models import User, Group


class UserDirectory(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    groups = models.ManyToManyField(Group, related_name = 'user_directories', blank = True)

    def __str__(self):
        return self.user.username


class MachineModel(models.Model):
    machine_model_name = models.CharField(max_length = 16)


class EngineModel(models.Model):
    engine_model_name = models.CharField(max_length = 16)


class TransmissionModel(models.Model):
    transmission_model_name = models.CharField(max_length = 16)


class LeadBridgeModel(models.Model):
    lead_bridge_model_name = models.CharField(max_length = 16)


class ControlledBridgeModel(models.Model):
    controlled_bridge_model_name = models.CharField(max_length = 16)


class Machine(models.Model):
    machine_factory_number = models.CharField(max_length = 16, unique = True)
    machine_model = models.ForeignKey(MachineModel, on_delete = models.CASCADE)
    engine_model = models.ForeignKey(EngineModel, on_delete = models.CASCADE)
    engine_factory_number = models.CharField(max_length = 16)
    transmission_model = models.ForeignKey(TransmissionModel, on_delete = models.CASCADE)
    transmission_factory_number = models.CharField(max_length = 16)
    lead_bridge_model = models.ForeignKey(LeadBridgeModel, on_delete = models.CASCADE)
    lead_bridge_factory_number = models.CharField(max_length = 16)
    controlled_bridge_model = models.ForeignKey(ControlledBridgeModel, on_delete = models.CASCADE)
    controlled_bridge_factory_number = models.CharField(max_length = 16)
    supply_contract_number_date = models.CharField(max_length = 16)
    date_shipment_from_factory = models.DateField()
    consumer = models.CharField(max_length = 32)
    delivery_address = models.CharField(max_length = 64)
    configuration = models.TextField(max_length = 1024)
    client = models.ForeignKey(UserDirectory, on_delete = models.CASCADE, related_name = 'machines')
    service_company = models.ForeignKey(UserDirectory, on_delete = models.CASCADE, related_name = 'service_companies')
