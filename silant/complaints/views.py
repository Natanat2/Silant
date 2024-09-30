from rest_framework import viewsets
from .models import Complaints
from .serializers import ComplaintsSerializer
from .permissions import IsClientOrManagerOrServiceCompany


class ComplaintsViewSet(viewsets.ModelViewSet):
    queryset = Complaints.objects.all()
    serializer_class = ComplaintsSerializer
    permission_classes = [IsClientOrManagerOrServiceCompany]
