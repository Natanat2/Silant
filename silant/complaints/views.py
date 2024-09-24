from rest_framework import generics
from .models import Complaints
from .serializers import ComplaintsSerializer


class ComplaintsListCreateView(generics.ListCreateAPIView):
    queryset = Complaints.objects.all()
    serializer_class = ComplaintsSerializer
