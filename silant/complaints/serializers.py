from rest_framework import serializers
from .models import Complaints, Nodes, MethodsOfRecovery
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


class NodesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nodes
        fields = ['id', 'name_of_node']


class MethodsOfRecoverySerializer(serializers.ModelSerializer):
    class Meta:
        model = MethodsOfRecovery
        fields = ['id', 'name_of_method']


class ComplaintsSerializer(serializers.ModelSerializer):
    machine = MachineSerializer()
    failure_node = NodesSerializer()
    method_of_recovery = MethodsOfRecoverySerializer()
    service_company_maintenance = UserDirectorySerializer()

    class Meta:
        model = Complaints
        fields = '__all__'


class ComplaintsCreateUpdateSerializer(serializers.ModelSerializer):
    machine = serializers.PrimaryKeyRelatedField(queryset = Machine.objects.all())
    failure_node = serializers.PrimaryKeyRelatedField(queryset = Nodes.objects.all())
    method_of_recovery = serializers.PrimaryKeyRelatedField(queryset = MethodsOfRecovery.objects.all())
    service_company_maintenance = serializers.PrimaryKeyRelatedField(
        queryset = UserDirectory.objects.filter(groups__name = 'ServiceCompany'))

    class Meta:
        model = Complaints
        fields = '__all__'
