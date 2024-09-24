from django.urls import path
from .views import ComplaintsListCreateView


urlpatterns = [
    path('', ComplaintsListCreateView.as_view(), name = 'complaints-list-create'),
]
