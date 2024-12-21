from rest_framework.permissions import SAFE_METHODS
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Machine
from .serializers import *


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        groups = user.groups.values_list('name', flat=True)
        return Response({
            'id': user.id,
            'username': user.first_name,
            'groups': groups,
        })


class ValidateTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        try:
            access_token = AccessToken(token)
            return Response({"valid": True})
        except Exception as e:
            return Response({"valid": False, "error": str(e)}, status = 400)


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all()
    serializer_class = MachinePublicSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['machine_factory_number']

    @extend_schema(
        parameters = [
            OpenApiParameter(
                name = 'machine_factory_number',
                description = 'Filter by machine factory number',
                required = False,
                type = str,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user

        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            # Возвращаем все объекты для действий с конкретным объектом
            return Machine.objects.all()

        # Фильтрация для списка
        queryset = Machine.objects.all()
        machine_factory_number = self.request.query_params.get('machine_factory_number')

        if machine_factory_number:
            queryset = queryset.filter(machine_factory_number = machine_factory_number)

        # Применяем ограничения на доступ
        if user.groups.filter(name = 'Manager').exists():
            return queryset
        elif user.groups.filter(name = 'Client').exists():
            return queryset.filter(client = user.userdirectory)
        elif user.groups.filter(name = 'ServiceCompany').exists():
            return queryset.filter(service_company = user.userdirectory)

        return Machine.objects.none()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MachineCreateUpdateSerializer
        elif self.request.user.groups.filter(name = 'Manager').exists():
            return MachineDetailedSerializer
        elif self.request.user.groups.filter(name__in = ['Client', 'ServiceCompany']).exists():
            return MachineDetailedSerializer
        return MachinePublicSerializer


class UserMachinesView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description = "Retrieve all machines available for the current user",
        responses = {
            200: MachinePublicSerializer(many = True),
        },
    )
    def get(self, request):
        user = request.user
        queryset = Machine.objects.all()

        if user.groups.filter(name = 'Manager').exists():

            serializer_class = MachineDetailedSerializer
        elif user.groups.filter(name = 'Client').exists():
            queryset = queryset.filter(client = user.userdirectory)
            serializer_class = MachineDetailedSerializer
        elif user.groups.filter(name = 'ServiceCompany').exists():
            queryset = queryset.filter(service_company = user.userdirectory)
            serializer_class = MachineDetailedSerializer
        else:
            queryset = Machine.objects.none()
            serializer_class = MachinePublicSerializer

        serializer = serializer_class(queryset, many = True)
        return Response(serializer.data)


class PublicMachineListView(ListAPIView):
    queryset = Machine.objects.all()
    permission_classes = [AllowAny]  # Открытая ручка для неавторизованных
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['machine_factory_number']

    def get_serializer_class(self):
        # Для авторизованных пользователей возвращаем полный набор данных
        if self.request.user.is_authenticated:
            return MachineDetailedSerializer
        # Для неавторизованных пользователей — ограниченный набор данных
        return MachinePublicSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset

        # Фильтрация по machine_factory_number, если передан параметр
        machine_factory_number = self.request.query_params.get('machine_factory_number')

        # Если параметр отсутствует, возвращаем пустой список
        if not machine_factory_number:
            return Machine.objects.none()

        queryset = queryset.filter(machine_factory_number = machine_factory_number)

        # Добавляем фильтрацию по группе пользователя, если необходимо
        if self.request.user.is_authenticated:
            if user.groups.filter(name = 'Manager').exists():
                # Для менеджеров — все объекты
                return queryset
            elif user.groups.filter(name = 'Client').exists():
                # Для клиентов — фильтрация по клиенту
                queryset = queryset.filter(client = user.userdirectory)
            elif user.groups.filter(name = 'ServiceCompany').exists():
                # Для сервисных компаний — фильтрация по сервисной компании
                queryset = queryset.filter(service_company = user.userdirectory)

        return queryset


class MachineDependenciesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        machine_models = MachineModelSerializer(MachineModel.objects.all(), many = True).data
        engine_models = EngineModelSerializer(EngineModel.objects.all(), many = True).data
        transmission_models = TransmissionModelSerializer(TransmissionModel.objects.all(), many = True).data
        lead_bridge_models = LeadBridgeModelSerializer(LeadBridgeModel.objects.all(), many = True).data
        controlled_bridge_models = ControlledBridgeModelSerializer(ControlledBridgeModel.objects.all(),
                                                                   many = True).data

        clients = UserDirectorySerializer(
            UserDirectory.objects.filter(groups__name = "Client").distinct(),
            many = True
        ).data
        service_companies = UserDirectorySerializer(
            UserDirectory.objects.filter(groups__name = "ServiceCompany").distinct(),
            many = True
        ).data

        return Response({
            "machine_models": machine_models,
            "engine_models": engine_models,
            "transmission_models": transmission_models,
            "lead_bridge_models": lead_bridge_models,
            "controlled_bridge_models": controlled_bridge_models,
            "clients": clients,
            "service_companies": service_companies,
        })
