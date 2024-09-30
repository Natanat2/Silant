from rest_framework import viewsets
from .models import Maintenance
from .serializers import MaintenanceSerializer
from .permissions import IsClientOrManagerOrServiceCompany


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    permission_classes = [IsClientOrManagerOrServiceCompany]
