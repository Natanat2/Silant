from django.urls import path
from .views import MachineListCreateView

urlpatterns = [
    path('machines/', MachineListCreateView.as_view(), name='machine-list-create'),
]
