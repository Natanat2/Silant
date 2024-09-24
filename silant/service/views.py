from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Machine
from .serializers import MachinePublicSerializer, MachineDetailedSerializer


class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return MachineDetailedSerializer
        return MachinePublicSerializer
