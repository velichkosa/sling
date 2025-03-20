from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from dict.models import FormFactor, WorkType
from dict.serializers import FormFactorSerializer, WorkTypeSerializer


class FormFactorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FormFactor.objects.all()
    serializer_class = FormFactorSerializer
    permission_classes = [AllowAny]


class WorkTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WorkType.objects.all()
    serializer_class = WorkTypeSerializer
    permission_classes = [AllowAny]
