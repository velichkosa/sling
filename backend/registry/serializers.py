from rest_framework import serializers
from dict.serializers import EquipmentParametersSerializer, OrgSerializer, LicenseCategoriesSerializer, \
    TechStatusSerializer, LocationSerializer, TechTypeSerializer, EventSerializer
from registry.models import ShiftEvent, Equipment, Operator, Tech, VwShiftSummary, Shifts


class EquipmentSerializer(serializers.ModelSerializer):
    parameters = EquipmentParametersSerializer(many=True)

    class Meta:
        model = Equipment
        fields = ['id', 'name', 'parameters']


class TechSerializer(serializers.ModelSerializer):
    home_location = LocationSerializer()
    org = OrgSerializer()
    status = TechStatusSerializer()
    type = TechTypeSerializer()
    equipment = EquipmentSerializer(many=True)

    class Meta:
        model = Tech
        fields = ['id', 'gos_num', 'type', 'org', 'status', 'home_location', 'equipment', 'is_active']


class TechTableSerializer(serializers.ModelSerializer):
    type_full = serializers.SerializerMethodField()
    org = serializers.CharField()
    status = serializers.CharField()
    type = serializers.CharField()
    equipment = serializers.SerializerMethodField()

    class Meta:
        model = Tech
        fields = ['id', 'gos_num', 'type', 'type_full', 'org', 'status', 'is_active',
                  'equipment']  # Только основные поля

    def get_equipment(self, obj):
        # Получаем список оборудования и формируем строку
        equipment_names = obj.equipment.values_list('name', flat=True)
        equipment_info = ', '.join(equipment_names) if equipment_names else 'Нет оборудования'

        # Добавляем информацию об оборудовании в поле type
        return equipment_info

    def get_type_full(self, obj):
        # Получаем список оборудования
        equipment = obj.equipment.prefetch_related('parameters__parameters')

        equipment_info = []
        for item in equipment:
            # Собираем параметры для каждого оборудования
            parameters_info = []
            for param in item.parameters.all():
                parameters_info.append(f"{param.parameters.name}: {param.value}")

            # Формируем строку вида: "<название оборудования> (<параметры>)"
            param_str = f" ({', '.join(parameters_info)})" if parameters_info else ""
            equipment_info.append(f"{item.name}{param_str}")

        # Если оборудование есть, собираем строку, иначе указываем "Нет оборудования"
        equipment_details = '; '.join(equipment_info) if equipment_info else "Нет оборудования"

        # Возвращаем строку вида "<тип техники> (<оборудование>)"
        return f"{obj.type} ({equipment_details})"


class OperatorSerializer(serializers.ModelSerializer):
    org = OrgSerializer()
    license_categories = LicenseCategoriesSerializer(many=True)

    class Meta:
        model = Operator
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'experience', 'org', 'license_categories']


class ShiftsSerializer(serializers.ModelSerializer):
    tech = TechSerializer()
    operator = OperatorSerializer()

    class Meta:
        model = Shifts
        fields = ['id', 'start_time', 'end_time', 'tech', 'operator']


class ShiftEventSerializer(serializers.ModelSerializer):
    shift = ShiftsSerializer()
    event = EventSerializer()

    class Meta:
        model = ShiftEvent
        fields = ['id', 'start_time', 'end_time', 'confirmation', 'shift', 'event']


class VwShiftSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = VwShiftSummary
        fields = ['id', 'start_time', 'finish_time', 'shift_duration_seconds', 'tech_gos_number', 'tech_type',
                  'tech_status', 'org', 'event_id', 'event_name', 'event_finish_time', 'event_start_time',
                  'event_finish_time', 'event_duration_seconds', 'event_confirmation',
                  'equipment_details']
