from rest_framework import viewsets
from .models import Maintenance
from .serializers import MaintenanceSerializer, MaintenanceCreateUpdateSerializer
from .permissions import IsClientOrManagerOrServiceCompany


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClientOrManagerOrServiceCompany]
    queryset = Maintenance.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MaintenanceCreateUpdateSerializer
        return MaintenanceSerializer
