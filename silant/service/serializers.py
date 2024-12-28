from rest_framework import serializers
from .models import UserDirectory, Machine, MachineModel, EngineModel, TransmissionModel, LeadBridgeModel, \
    ControlledBridgeModel


class CurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    groups = serializers.ListField(child = serializers.CharField())


class ValidateTokenSerializer(serializers.Serializer):
    valid = serializers.BooleanField()
    error = serializers.CharField(allow_blank = True, required = False)


class UserDirectorySerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = UserDirectory
        fields = ['id', 'user_full_name']

    def get_user_full_name(self, obj) -> str:
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


class MachineCreateUpdateSerializer(serializers.ModelSerializer):
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


class MachineDependenciesSerializer(serializers.Serializer):
    machine_models = MachineModelSerializer(many = True)
    engine_models = EngineModelSerializer(many = True)
    transmission_models = TransmissionModelSerializer(many = True)
    lead_bridge_models = LeadBridgeModelSerializer(many = True)
    controlled_bridge_models = ControlledBridgeModelSerializer(many = True)
    clients = UserDirectorySerializer(many = True)
    service_companies = UserDirectorySerializer(many = True)


class MachineListSerializer(serializers.ModelSerializer):
    machine_model = MachineModelSerializer()

    class Meta:
        model = Machine
        fields = ['id', 'machine_factory_number', 'machine_model']
