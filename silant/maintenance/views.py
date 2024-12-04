from rest_framework.permissions import SAFE_METHODS
from rest_framework import viewsets
from .permissions import IsClientOrManagerOrServiceCompany
from .models import Maintenance
from .serializers import MaintenanceSerializer, MaintenanceCreateUpdateSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsClientOrManagerOrServiceCompany]
    queryset = Maintenance.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MaintenanceCreateUpdateSerializer
        return MaintenanceSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Maintenance.objects.all()

        if user.groups.filter(name='Manager').exists():
            # Менеджеры видят все записи
            return queryset
        elif user.groups.filter(name='Client').exists():
            # Клиенты видят только записи машин, привязанных к ним
            return queryset.filter(machine__client=user.userdirectory)
        elif user.groups.filter(name='ServiceCompany').exists():
            # Сервисные компании видят только записи машин, привязанных к ним
            return queryset.filter(machine__service_company=user.userdirectory)

        # Если пользователь не входит ни в одну из групп, возвращаем пустой набор данных
        return queryset.none()
