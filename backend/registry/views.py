from datetime import datetime, timedelta
import logging

import django_filters
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from dict.models import Event
from registry.helpers import get_operator_and_tech, create_new_shift, create_event, last_shift, last_event
from registry.models import ShiftEvent, Shifts, Tech, VwShiftSummary
from registry.serializers import ShiftEventSerializer, ShiftsSerializer, TechSerializer, VwShiftSummarySerializer, \
    TechTableSerializer
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

logger = logging.getLogger(__name__)


class TechViewSet(ModelViewSet):
    queryset = Tech.objects.all()
    serializer_class = TechSerializer
    permission_classes = [IsAuthenticated]


class TechTableViewSet(ReadOnlyModelViewSet):
    queryset = Tech.objects.all()
    serializer_class = TechTableSerializer
    permission_classes = [IsAuthenticated]


class ShiftEventViewSet(ModelViewSet):
    queryset = ShiftEvent.objects.all()
    serializer_class = ShiftEventSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get', 'post'], url_path='qr')
    def new_event(self, request):
        """Новое событие"""
        tech_id = request.query_params.get('tech_id')
        event_id = request.query_params.get('event_id')

        # Получаем технику и оператора
        result = get_operator_and_tech(tech_id)
        if isinstance(result, Response):
            return result
        tech = result

        # создаем событие
        event = create_event(tech, event_id)
        if isinstance(event, Response):
            return event

        return Response(
            {"message": "Событие добавлено", "shift_event_id": str(event.id)},
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get', 'put'], url_path='qr/confirm')
    def confirm_event(self, request):
        """Новое событие"""
        event_id = request.query_params.get('event_id')

        try:
            event = ShiftEvent.objects.get(id=event_id)
        except ShiftEvent.DoesNotExist:
            return Response({"error": "Событие не найдено"}, status=status.HTTP_404_NOT_FOUND)

        # Инвертируем значение
        event.confirmation = not event.confirmation
        event.save()

        return Response(
            {"message": "Подтверждение обновлено", "shift_event_id": str(event.id)},
            status=status.HTTP_200_OK
        )


class ShiftsViewSet(ModelViewSet):
    queryset = Shifts.objects.all()
    serializer_class = ShiftsSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get', 'post'], url_path='qr/start')
    def start(self, request):
        """Старт смены"""
        tech_id = request.query_params.get('tech_id')
        # operator_id = request.query_params.get('operator_id')

        # Получаем технику и оператора
        tech = get_operator_and_tech(tech_id)

        # проверка на не закрытые смены
        lastshift = last_shift(tech)
        if isinstance(lastshift, Response):
            return lastshift

        if lastshift.start_time + timedelta(hours=12) > timezone.now():
            return Response(
                {"message": "Смена в этот день уже есть", "shift_id": str(lastshift.id)},
                status=status.HTTP_200_OK
            )
        else:
            lastshift.end_time = lastshift.start_time + timedelta(hours=12)
            lastshift.save()

            # Создаем новую смену с текущим временем начала
            shift = create_new_shift(tech)

        return Response(
            {"message": "Смена начата", "shift_id": str(shift.id)},
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get', 'post'], url_path='qr/finish')
    def finish(self, request):
        """Завершение смены"""
        tech_id = request.query_params.get('tech_id')
        # operator_id = request.query_params.get('operator_id')

        # Получаем технику и оператора
        tech = get_operator_and_tech(tech_id)

        # закрываем смену
        lastshift = last_shift(tech)
        if isinstance(lastshift, Response):
            return lastshift

        if not lastshift:
            return Response(
                {"message": "Нет открытых смен для СПТ", "tech_id": str(tech.id)},
                status=status.HTTP_204_NO_CONTENT
            )
        # закрываем последннее событие в смене
        lastevent = last_event(lastshift)
        if isinstance(lastevent, Response):
            return lastevent
        lastevent.end_time = timezone.now()
        lastevent.save()

        # закрываем смену
        lastshift.end_time = timezone.now()
        lastshift.save()

        return Response(
            {"message": "Смена завершена", "shift_id": str(lastshift.id)},
            status=status.HTTP_200_OK
        )


class VwShiftSummaryViewFilter(django_filters.FilterSet):
    """ Фильтрация по полям, которые доступны в представлении VwShiftSummaryViewSet"""
    id = django_filters.CharFilter(field_name="id", lookup_expr="icontains")

    start_time = django_filters.DateFilter(method='filter_by_date', input_formats=['%d.%m.%Y'])
    finish_time = django_filters.DateTimeFilter(field_name="finish_time")
    shift_duration_seconds = django_filters.NumberFilter(field_name="shift_duration_seconds", lookup_expr="icontains")
    tech_gos_number = django_filters.CharFilter(field_name="tech_gos_number", lookup_expr="icontains")
    tech_type = django_filters.CharFilter(field_name="tech_type", lookup_expr="icontains")
    tech_status = django_filters.CharFilter(field_name="tech_status", lookup_expr="icontains")
    org = django_filters.CharFilter(field_name="org", lookup_expr="icontains")
    event_name = django_filters.CharFilter(field_name="event_name", lookup_expr="icontains")
    event_start_time = django_filters.DateFilter(method="filter_by_date", input_formats=['%d.%m.%Y'])
    event_finish_time = django_filters.DateTimeFilter(field_name="event_finish_time")
    event_duration_seconds = django_filters.NumberFilter(field_name="event_duration_seconds", lookup_expr="icontains")
    equipment_details = django_filters.CharFilter(field_name="equipment_details", lookup_expr="icontains")

    def filter_by_date(self, queryset, name, value):
        """Фильтруем start_time только по дате (без учета времени)"""
        return queryset.filter(start_time__date=value)

    class Meta:
        model = VwShiftSummary
        fields = ['id', 'start_time', 'finish_time', 'shift_duration_seconds', 'tech_gos_number', 'tech_type',
                  'tech_status', 'org', 'event_name', 'event_start_time', 'event_finish_time', 'event_duration_seconds',
                  'equipment_details']


class VwShiftSummaryViewSet(ReadOnlyModelViewSet):
    queryset = VwShiftSummary.objects.all()
    serializer_class = VwShiftSummarySerializer
    filterset_class = VwShiftSummaryViewFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    permission_classes = [IsAuthenticated]

    ordering_fields = ['start_time', 'finish_time']
    ordering = ['-start_time', 'org']

    def get_queryset(self):
        queryset = super().get_queryset()
        start_time_param = self.request.query_params.get('start_time', None)
        event_start_time_param = self.request.query_params.get('event_start_time', None)

        if start_time_param:
            try:
                start_time = datetime.strptime(start_time_param, '%d.%m.%Y').date()
                queryset = queryset.filter(start_time__date=start_time)
            except ValueError:
                print(f"Invalid date format: {start_time_param}")

        if event_start_time_param:
            try:
                event_start_time = datetime.strptime(event_start_time_param, '%d.%m.%Y').date()
                queryset = queryset.filter(event_start_time__date=event_start_time)
            except ValueError:
                print(f"Invalid date format: {event_start_time_param}")

        print(self.request.query_params)  # Вывод параметров запроса для отладки
        return queryset
