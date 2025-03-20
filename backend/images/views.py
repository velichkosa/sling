from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from images.models import Image
from images.serializers import ImageSerializer


class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]
