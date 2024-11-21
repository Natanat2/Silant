from rest_framework.permissions import SAFE_METHODS, IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Machine
from .serializers import MachinePublicSerializer, MachineDetailedSerializer, MachineCreateUpdateSerializer
from .permissions import IsClientOrServiceCompanyOrManager


class MachineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsClientOrServiceCompanyOrManager]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'machine_factory_number',
                openapi.IN_QUERY,
                description="Filter by machine factory number",
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        queryset = Machine.objects.all()

        # Получение параметра фильтрации из строки запроса
        machine_factory_number = self.request.query_params.get('machine_factory_number')
        if machine_factory_number:
            queryset = queryset.filter(machine_factory_number=machine_factory_number)

        if self.request.method in SAFE_METHODS:
            return queryset

        if user.groups.filter(name='Manager').exists():
            return queryset

        elif user.groups.filter(name='Client').exists():
            return queryset.filter(client=user.userdirectory)

        elif user.groups.filter(name='ServiceCompany').exists():
            return queryset.filter(service_company=user.userdirectory)

        return Machine.objects.none()

    def get_serializer_class(self):
        user = self.request.user

        if user.groups.filter(name='Manager').exists():
            return MachineCreateUpdateSerializer

        if user.groups.filter(name='Client').exists() or user.groups.filter(name='ServiceCompany').exists():
            return MachineDetailedSerializer

        return MachinePublicSerializer
