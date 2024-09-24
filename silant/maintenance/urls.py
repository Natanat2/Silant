from django.urls import path
from .views import MaintenanceListCreateView


urlpatterns = [
    path('', MaintenanceListCreateView.as_view(), name = 'maintenance-list-create'),
]
