from rest_framework.permissions import BasePermission


class IsClientOrManagerOrServiceCompany(BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.groups.filter(name__in = ['Client', 'Manager', 'ServiceCompany']).exists():
            return True

        return False
