from django.urls import path
from .views import MaintenanceListCreateView

urlpatterns = [
    path('machines/', MaintenanceListCreateView.as_view(), name = 'machine-list-create'),
]
