from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),

    path('api/token/', TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),

    path('api/service/', include('service.urls')),
    path('api/maintenance/', include('maintenance.urls')),
    path('api/complaints/', include('complaints.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name = 'schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name = 'schema'), name = 'swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name = 'schema'), name = 'redoc'),
]
