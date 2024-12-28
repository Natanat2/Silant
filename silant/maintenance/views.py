from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from .permissions import IsClientOrManagerOrServiceCompany
from .models import Maintenance, TypeOfMaintenance
from .serializers import MaintenanceSerializer, MaintenanceCreateUpdateSerializer, TypeOfMaintenanceSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClientOrManagerOrServiceCompany]
    queryset = Maintenance.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MaintenanceCreateUpdateSerializer
        return MaintenanceSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Maintenance.objects.all()

        if user.groups.filter(name='Manager').exists():
            return queryset
        elif user.groups.filter(name='Client').exists():
            return queryset.filter(machine__client=user.userdirectory)
        elif user.groups.filter(name='ServiceCompany').exists():
            return queryset.filter(machine__service_company=user.userdirectory)

        return queryset.none()

    @action(detail=False, methods=['get'], url_path='filter-by-machine')
    def filter_by_machine(self, request):

        machine_factory_number = request.query_params.get('machine_factory_number')
        if not machine_factory_number:
            return Response({"error": "machine_factory_number is required"}, status=400)

        queryset = self.get_queryset().filter(machine__machine_factory_number=machine_factory_number)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail = False, methods = ['get'], url_path = 'types_of_maintenance')
    def types_of_maintenance(self, request):
        queryset = TypeOfMaintenance.objects.all()
        serializer = TypeOfMaintenanceSerializer(queryset, many = True)
        return Response(serializer.data)
