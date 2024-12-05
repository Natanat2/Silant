from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MachineViewSet, CurrentUserView, ValidateTokenView, UserMachinesView, PublicMachineListView

router = DefaultRouter()
router.register(r'', MachineViewSet, basename='machine')

urlpatterns = [
    path('', include(router.urls)),
    path('current_user', CurrentUserView.as_view(), name='current_user'),
    path('validate_user', ValidateTokenView.as_view(), name='validate_user'),
    path('user_machines', UserMachinesView.as_view(), name='user_machines'),
    path('public_machines', PublicMachineListView.as_view(), name='public_machines'),  # Новая ручка
]
