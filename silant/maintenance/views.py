from rest_framework import generics
from .models import Maintenance
from .serializers import MaintenanceSerializer


class MaintenanceListCreateView(generics.ListCreateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
