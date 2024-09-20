from django.contrib import admin
from .models import *


class UserDirectoryAdmin(admin.ModelAdmin):
    list_display = ('user',)


class MachineModelAdmin(admin.ModelAdmin):
    list_display = ('machine_model_name', 'description_of_machine_model')


class EngineModelAdmin(admin.ModelAdmin):
    list_display = ('engine_model_name', 'description_of_engine_model')


class TransmissionModelAdmin(admin.ModelAdmin):
    list_display = ('transmission_model_name', 'description_of_transmission_model')


class LeadBridgeModelAdmin(admin.ModelAdmin):
    list_display = ('lead_bridge_model_name', 'description_of_lead_bridge_model')


class ControlledBridgeModelAdmin(admin.ModelAdmin):
    list_display = ('controlled_bridge_model_name', 'description_of_controlled_bridge_model')


class MachineAdmin(admin.ModelAdmin):
    list_display = (
        'machine_factory_number', 'machine_model', 'engine_model', 'transmission_model',
        'lead_bridge_model', 'controlled_bridge_model', 'date_shipment_from_factory', 'client'
    )
    list_filter = ('machine_model', 'engine_model', 'transmission_model', 'client')
    search_fields = ('machine_factory_number', 'client__user__first_name')


admin.site.register(UserDirectory, UserDirectoryAdmin)
admin.site.register(MachineModel, MachineModelAdmin)
admin.site.register(EngineModel, EngineModelAdmin)
admin.site.register(TransmissionModel, TransmissionModelAdmin)
admin.site.register(LeadBridgeModel, LeadBridgeModelAdmin)
admin.site.register(ControlledBridgeModel, ControlledBridgeModelAdmin)
admin.site.register(Machine, MachineAdmin)
