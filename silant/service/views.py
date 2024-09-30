from rest_framework.permissions import SAFE_METHODS, IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from .models import Machine
from .serializers import MachinePublicSerializer, MachineDetailedSerializer
from .permissions import IsClientOrServiceCompanyOrManager


class MachineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsClientOrServiceCompanyOrManager]

    def get_queryset(self):
        user = self.request.user

        if self.request.method in SAFE_METHODS:
            return Machine.objects.all()

        if user.groups.filter(name = 'Manager').exists():
            return Machine.objects.all()

        elif user.groups.filter(name = 'Client').exists():
            return Machine.objects.filter(client = user.userdirectory)

        elif user.groups.filter(name = 'ServiceCompany').exists():
            return Machine.objects.filter(service_company = user.userdirectory)

        return Machine.objects.none()

    def get_serializer_class(self):
        user = self.request.user

        if user.groups.filter(name = 'Manager').exists():
            return MachineDetailedSerializer

        if user.groups.filter(name = 'Client').exists() or user.groups.filter(name = 'ServiceCompany').exists():
            return MachineDetailedSerializer

        return MachinePublicSerializer
