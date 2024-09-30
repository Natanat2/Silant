from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsClientOrServiceCompanyOrManager(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.groups.filter(name = 'Manager').exists():
            return True

        if request.user.groups.filter(name = 'Client').exists():
            return obj.client == request.user.userdirectory

        if request.user.groups.filter(name = 'ServiceCompany').exists():
            return obj.service_company == request.user.userdirectory

        return False
