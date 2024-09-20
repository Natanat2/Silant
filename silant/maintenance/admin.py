from django.contrib import admin
from .models import *


class TypeOfMaintenanceAdmin(admin.ModelAdmin):
    list_display = ('type_of_maintenance_name', 'description_of_type_of_maintenance')


class OrganizationCarriedMaintenanceAdmin(admin.ModelAdmin):
    list_display = ('name_organization', 'description_of_organization')


class MaintenanceAdmin(admin.ModelAdmin):
    list_display = (
        'order_number', 'machine', 'type_of_maintenance', 'date_of_maintenance', 'operating_time', 'order_date',
        'organization_carried_maintenance', 'service_company_maintenance')
    list_filter = ('date_of_maintenance', 'type_of_maintenance', 'machine')


admin.site.register(TypeOfMaintenance, TypeOfMaintenanceAdmin)
admin.site.register(OrganizationCarriedMaintenance, OrganizationCarriedMaintenanceAdmin)
admin.site.register(Maintenance, MaintenanceAdmin)
