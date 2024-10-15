from rest_framework import serializers
from .models import Maintenance, TypeOfMaintenance, OrganizationCarriedMaintenance
from service.models import Machine, UserDirectory
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name']


class UserDirectorySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserDirectory
        fields = ['id', 'user']


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'machine_factory_number']


class TypeOfMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfMaintenance
        fields = ['id', 'type_of_maintenance_name']


class OrganizationCarriedMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationCarriedMaintenance
        fields = ['id', 'name_organization']


class MaintenanceSerializer(serializers.ModelSerializer):
    machine = MachineSerializer()
    type_of_maintenance = TypeOfMaintenanceSerializer()
    organization_carried_maintenance = OrganizationCarriedMaintenanceSerializer()
    service_company_maintenance = UserDirectorySerializer()

    class Meta:
        model = Maintenance
        fields = '__all__'


class MaintenanceCreateUpdateSerializer(serializers.ModelSerializer):
    machine = serializers.PrimaryKeyRelatedField(queryset = Machine.objects.all())
    type_of_maintenance = serializers.PrimaryKeyRelatedField(queryset = TypeOfMaintenance.objects.all())
    organization_carried_maintenance = serializers.PrimaryKeyRelatedField(
        queryset = OrganizationCarriedMaintenance.objects.all())
    service_company_maintenance = serializers.PrimaryKeyRelatedField(
        queryset = UserDirectory.objects.filter(groups__name = 'ServiceCompany'))

    class Meta:
        model = Maintenance
        fields = '__all__'
