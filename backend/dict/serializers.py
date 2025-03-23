from rest_framework import serializers

from dict.models import WorkType, FormFactor, Tag, Slings


class WorkTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkType
        fields = ['id', 'name', 'description']


class FormFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormFactor
        fields = ['id', 'name', 'description']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class SlingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slings
        fields = ('id', 'name', 'image', 'description')
