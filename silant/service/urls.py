from django.urls import path
from .views import MachineListCreateView


urlpatterns = [
    path('', MachineListCreateView.as_view(), name = 'machine-list-create'),
]
