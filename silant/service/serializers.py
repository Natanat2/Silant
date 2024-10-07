from rest_framework import serializers
from .models import UserDirectory, Machine, MachineModel, EngineModel, TransmissionModel, LeadBridgeModel, \
    ControlledBridgeModel


class UserDirectorySerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = UserDirectory
        fields = ['id', 'user_full_name']

    def get_user_full_name(self, obj):
        return obj.user.first_name


class MachineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineModel
        fields = ['id', 'machine_model_name']


class EngineModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineModel
        fields = ['id', 'engine_model_name']


class TransmissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransmissionModel
        fields = ['id', 'transmission_model_name']


class LeadBridgeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadBridgeModel
        fields = ['id', 'lead_bridge_model_name']


class ControlledBridgeModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlledBridgeModel
        fields = ['id', 'controlled_bridge_model_name']


class MachinePublicSerializer(serializers.ModelSerializer):
    machine_model = MachineModelSerializer()
    engine_model = EngineModelSerializer()
    transmission_model = TransmissionModelSerializer()
    lead_bridge_model = LeadBridgeModelSerializer()
    controlled_bridge_model = ControlledBridgeModelSerializer()

    class Meta:
        model = Machine
        fields = [
            'machine_factory_number',
            'machine_model',
            'engine_model',
            'engine_factory_number',
            'transmission_model',
            'transmission_factory_number',
            'lead_bridge_model',
            'lead_bridge_factory_number',
            'controlled_bridge_model',
            'controlled_bridge_factory_number',
        ]


class MachineWriteSerializer(serializers.ModelSerializer):
    machine_model = serializers.PrimaryKeyRelatedField(queryset = MachineModel.objects.all())
    engine_model = serializers.PrimaryKeyRelatedField(queryset = EngineModel.objects.all())
    transmission_model = serializers.PrimaryKeyRelatedField(queryset = TransmissionModel.objects.all())
    lead_bridge_model = serializers.PrimaryKeyRelatedField(queryset = LeadBridgeModel.objects.all())
    controlled_bridge_model = serializers.PrimaryKeyRelatedField(queryset = ControlledBridgeModel.objects.all())
    client = serializers.PrimaryKeyRelatedField(queryset = UserDirectory.objects.all())
    service_company = serializers.PrimaryKeyRelatedField(queryset = UserDirectory.objects.all())

    class Meta:
        model = Machine
        fields = [
            'machine_factory_number',
            'machine_model',
            'engine_model',
            'engine_factory_number',
            'transmission_model',
            'transmission_factory_number',
            'lead_bridge_model',
            'lead_bridge_factory_number',
            'controlled_bridge_model',
            'controlled_bridge_factory_number',
            'client',
            'service_company',
            'supply_contract_number_date',
            'date_shipment_from_factory',
            'consumer',
            'delivery_address',
            'configuration',
        ]


class MachineDetailedSerializer(serializers.ModelSerializer):
    machine_model = MachineModelSerializer()
    engine_model = EngineModelSerializer()
    transmission_model = TransmissionModelSerializer()
    lead_bridge_model = LeadBridgeModelSerializer()
    controlled_bridge_model = ControlledBridgeModelSerializer()
    client = UserDirectorySerializer()
    service_company = UserDirectorySerializer()

    class Meta:
        model = Machine
        fields = '__all__'
