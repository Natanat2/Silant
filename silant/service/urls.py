from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MachineViewSet, current_user

router = DefaultRouter()
router.register(r'', MachineViewSet, basename='machine')

urlpatterns = [
    path('', include(router.urls)),
    path('api/current_user', current_user, name='current_user')
]
