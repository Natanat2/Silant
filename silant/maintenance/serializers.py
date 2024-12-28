from rest_framework import serializers
from .models import Maintenance, TypeOfMaintenance, OrganizationCarriedMaintenance
from service.models import Machine, UserDirectory
from django.contrib.auth.models import User


class MaintenanceUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name']


class MaintenanceUserDirectorySerializer(serializers.ModelSerializer):
    user = MaintenanceUserSerializer()

    class Meta:
        model = UserDirectory
        fields = ['id', 'user']


class MaintenanceMachineSerializer(serializers.ModelSerializer):
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
    machine = MaintenanceMachineSerializer()
    type_of_maintenance = TypeOfMaintenanceSerializer()
    organization_carried_maintenance = OrganizationCarriedMaintenanceSerializer()
    service_company_maintenance = MaintenanceUserDirectorySerializer()

    client_name = serializers.SerializerMethodField()

    class Meta:
        model = Maintenance
        fields = '__all__'

    def get_client_name(self, obj):
        return obj.machine.client.user.first_name if obj.machine.client else None


class MaintenanceCreateUpdateSerializer(serializers.ModelSerializer):
    machine = serializers.PrimaryKeyRelatedField(queryset = Machine.objects.all())
    type_of_maintenance = serializers.PrimaryKeyRelatedField(queryset = TypeOfMaintenance.objects.all())
    organization_carried_maintenance = serializers.PrimaryKeyRelatedField(
        queryset = OrganizationCarriedMaintenance.objects.all(),
        allow_null = True,
        required = False
    )
    service_company_maintenance = serializers.PrimaryKeyRelatedField(
        queryset = UserDirectory.objects.filter(groups__name = 'ServiceCompany'),
        allow_null = True,
        required = False
    )

    class Meta:
        model = Maintenance
        fields = '__all__'
