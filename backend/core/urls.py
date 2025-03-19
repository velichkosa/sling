from django.contrib import admin
from django.urls import re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from django.urls import path, include
from rest_framework import permissions


schema_view = get_schema_view(
    openapi.Info(
        title="Tech Service API",
        default_version='v1',
        description="API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="velichko.sergey.a@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),

    # users, JWT
    path('api/v1/', include('users.urls')),

    # registry
    path('api/v1/', include('registry.urls')),

    # route
    path('api/v1/', include(router.urls)),
]

swagger_urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

urlpatterns = urlpatterns + swagger_urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
