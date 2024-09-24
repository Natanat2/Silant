from django.urls import path
from .views import ComplaintsListCreateView

urlpatterns = [
    path('machines/', ComplaintsListCreateView.as_view(), name = 'machine-list-create'),
]
