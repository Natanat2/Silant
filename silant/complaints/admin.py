from django.contrib import admin
from .models import Nodes, MethodsOfRecovery, Complaints


class NodesAdmin(admin.ModelAdmin):
    list_display = ('name_of_node', 'description_of_node')
    search_fields = ('name_of_node', 'description_of_node')


class MethodsOfRecoveryAdmin(admin.ModelAdmin):
    list_display = ('name_of_method', 'description_of_method')
    search_fields = ('name_of_method', 'description_of_method')


class ComplaintsAdmin(admin.ModelAdmin):
    list_display = (
        'machine',
        'date_of_refusal',
        'operating_time_refusal',
        'failure_node',
        'description_of_refusal',
        'method_of_recovery',
        'spare_parts_used',
        'restoration_date',
        'downtime'
    )
    list_filter = ('date_of_refusal', 'restoration_date', 'failure_node', 'method_of_recovery')
    search_fields = ('machine__serial_number', 'failure_node__name_of_node', 'method_of_recovery__name_of_method',
                     'description_of_refusal')


admin.site.register(Nodes, NodesAdmin)
admin.site.register(MethodsOfRecovery, MethodsOfRecoveryAdmin)
admin.site.register(Complaints, ComplaintsAdmin)
