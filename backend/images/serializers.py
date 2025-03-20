from rest_framework import serializers

from dict.serializers import TagSerializer, WorkTypeSerializer, FormFactorSerializer
from images.models import Image


class ImageSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    work_types = WorkTypeSerializer(many=True, read_only=True)
    form_factors = FormFactorSerializer(many=True, read_only=True)

    class Meta:
        model = Image
        fields = (
            'id', 'created_at', 'updated_at', 'title', 'image', 'description', 'tags', 'work_types', 'form_factors')
