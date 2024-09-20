from django.contrib import admin
from .models import *


class MainAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


admin.site.register(TypeOfMaintenance, MainAdmin)
admin.site.register(OrganizationCarriedMaintenance, MainAdmin)
admin.site.register(Maintenance, MainAdmin)
