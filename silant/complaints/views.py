from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Complaints, MethodsOfRecovery, Nodes
from service.models import UserDirectory
from .serializers import ComplaintsSerializer, ComplaintsCreateUpdateSerializer, NodesSerializer, \
    MethodsOfRecoverySerializer, ComplaintsUserDirectorySerializer
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

        if user.groups.filter(name = 'Manager').exists():
            return queryset
        elif user.groups.filter(name = 'Client').exists():
            return queryset.filter(machine__client = user.userdirectory)
        elif user.groups.filter(name = 'ServiceCompany').exists():
            return queryset.filter(service_company_maintenance = user.userdirectory)

        return queryset.none()

    @action(detail = False, methods = ['get'], url_path = 'filter-by-machine')
    def filter_by_machine(self, request):

        machine_factory_number = request.query_params.get('machine_factory_number')
        if not machine_factory_number:
            return Response({"error": "machine_factory_number is required"}, status = 400)

        complaints = self.get_queryset().filter(machine__machine_factory_number = machine_factory_number)
        serializer = self.get_serializer(complaints, many = True)
        return Response(serializer.data)

    @action(detail = False, methods = ['get'], url_path = 'types_of_complaints')
    def types_of_complaints(self, request):

        nodes = Nodes.objects.all()
        methods = MethodsOfRecovery.objects.all()
        service_companies = UserDirectory.objects.filter(groups__name = "ServiceCompany")

        data = {
            "failure_nodes": NodesSerializer(nodes, many = True).data,
            "methods_of_recovery": MethodsOfRecoverySerializer(methods, many = True).data,
            "service_companies": ComplaintsUserDirectorySerializer(service_companies, many = True).data,
        }
        return Response(data)
