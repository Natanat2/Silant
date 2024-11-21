from rest_framework.permissions import SAFE_METHODS
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Machine
from .serializers import (
    MachinePublicSerializer,
    MachineCreateUpdateSerializer,
    MachineDetailedSerializer,
)


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachinePublicSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['machine_factory_number']

    @extend_schema(
        parameters = [
            OpenApiParameter(
                name = 'machine_factory_number',
                description = 'Filter by machine factory number',
                required = False,
                type = str,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        queryset = Machine.objects.all()
        machine_factory_number = self.request.query_params.get('machine_factory_number')

        if not machine_factory_number:
            return Machine.objects.none()

        if self.request.method not in SAFE_METHODS:
            if user.groups.filter(name = 'Manager').exists():
                return queryset.filter(machine_factory_number = machine_factory_number)
            elif user.groups.filter(name = 'Client').exists():
                return queryset.filter(client = user.userdirectory, machine_factory_number = machine_factory_number)
            elif user.groups.filter(name = 'ServiceCompany').exists():
                return queryset.filter(service_company = user.userdirectory,
                                       machine_factory_number = machine_factory_number)

        return queryset.filter(machine_factory_number = machine_factory_number)

    def get_serializer_class(self):
        user = self.request.user

        if user.groups.filter(name = 'Manager').exists():
            return MachineCreateUpdateSerializer
        elif user.groups.filter(name = 'Client').exists():
            return MachineDetailedSerializer
        elif user.groups.filter(name = 'ServiceCompany').exists():
            return MachineDetailedSerializer
        else:
            return MachinePublicSerializer
