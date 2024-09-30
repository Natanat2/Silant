from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintsViewSet

router = DefaultRouter()
router.register(r'', ComplaintsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
