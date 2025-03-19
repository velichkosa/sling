from rest_framework import serializers

from dict.models import EquipmentParameters, Parameters, Org, LicenseCategories, Location, TechStatus, TechType, \
    Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name']


class ParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameters
        fields = ['id', 'name']


class EquipmentParametersSerializer(serializers.ModelSerializer):
    parameters = ParametersSerializer()

    class Meta:
        model = EquipmentParameters
        fields = ['id', 'value', 'parameters']


class OrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Org
        fields = ['id', 'name', 'is_contractor']


class LicenseCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseCategories
        fields = ['id', 'name', 'description']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'description']


class TechStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStatus
        fields = ['id', 'name']


class TechTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechType
        fields = ['id', 'name']
