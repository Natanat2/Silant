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

    def get_queryset(self):
        user = self.request.user
        queryset = Complaints.objects.all()

        if user.groups.filter(name='Manager').exists():
            # Менеджеры видят все записи
            return queryset
        elif user.groups.filter(name='Client').exists():
            # Клиенты видят записи для машин, привязанных к ним
            return queryset.filter(machine__client=user.userdirectory)
        elif user.groups.filter(name='ServiceCompany').exists():
            # Сервисные компании видят записи, связанные с ними
            return queryset.filter(service_company_maintenance=user.userdirectory)

        # Если пользователь не принадлежит ни к одной группе, возвращается пустой набор данных
        return queryset.none()
