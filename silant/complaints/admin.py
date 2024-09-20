from django.contrib import admin
from .models import *


class MigrAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


admin.site.register(Nodes, MigrAdmin)
admin.site.register(MethodsOfRecovery, MigrAdmin)
admin.site.register(Complaints, MigrAdmin)
