from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MachineViewSet

router = DefaultRouter()
router.register(r'', MachineViewSet, basename='machine')

urlpatterns = [
    path('', include(router.urls)),
]
