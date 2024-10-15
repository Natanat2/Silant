from rest_framework import viewsets
from .models import Complaints
from .serializers import ComplaintsSerializer, ComplaintsCreateUpdateSerializer
from .permissions import IsClientOrManagerOrServiceCompany


class ComplaintsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClientOrManagerOrServiceCompany]
    queryset = Complaints.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ComplaintsCreateUpdateSerializer
        return ComplaintsSerializer
