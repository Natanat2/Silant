from django.contrib import admin
from .models import *

class BaseAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


admin.site.register(UserDirectory, BaseAdmin)
admin.site.register(Machine, BaseAdmin)
admin.site.register(MachineModel, BaseAdmin)
admin.site.register(EngineModel, BaseAdmin)
admin.site.register(TransmissionModel, BaseAdmin)
admin.site.register(LeadBridgeModel, BaseAdmin)
admin.site.register(ControlledBridgeModel, BaseAdmin)