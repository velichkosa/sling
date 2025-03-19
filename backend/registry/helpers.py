import logging
from datetime import timedelta

from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response

from core.consts import TASK_WAIT_ID
from dict.models import Event
from registry.models import Tech, Operator, Shifts, ShiftEvent


def create_event(tech: Tech, event_id: str) -> ShiftEvent | Response:
    """
    Создает событие в последней открытой смене для заданной техники и оператора.

    :param tech: Техника, для которой создается событие.
    :param operator: Оператор, связанный с техникой.
    :param event_id: Идентификатор события.
    :return: Созданное событие или объект Response с ошибкой.
    """
    try:
        # Получаем последнюю открытую смену
        lastshift = last_shift(tech)
        if isinstance(lastshift, Response):
            return lastshift

        if not lastshift:
            lastshift = create_new_shift(tech)
            # return Response({"error": "Нет начатых смен для данной техники и оператора"},
            #                 status=status.HTTP_204_NO_CONTENT)
        elif lastshift.start_time + timedelta(hours=12) < timezone.now():
            lastshift.end_time = lastshift.start_time + timedelta(hours=12)
            lastshift.save()
            lastshift = create_new_shift(tech)

        # получаем последнее не закрытое событие
        lastevent = last_event(shift=lastshift)
        if isinstance(lastevent, Response):
            return lastevent
        if lastevent:
            lastevent.end_time = timezone.now()
            lastevent.save()

        # Создаем новое событие в смене
        shift_event = ShiftEvent.objects.create(
            event_id=event_id,
            shift=lastshift,
            start_time=timezone.now(),
            end_time=None
        )

        return shift_event

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_operator_and_tech(tech_id: str) -> tuple | Response:
    """Получение оператора и техники"""

    try:
        tech = Tech.objects.get(pk=tech_id)
    except Tech.DoesNotExist:
        return Response({"error": "Техника не найдена"}, status=status.HTTP_400_BAD_REQUEST)

    return tech


def create_new_shift(tech: Tech) -> Shifts:
    """Создает новую смену и добавляет событие 'Ожидает задание' """

    shift = Shifts.objects.create(
        tech=tech,
        start_time=timezone.now(),
        end_time=None
    )

    # добавляем событие на Смене
    ShiftEvent.objects.create(
        start_time=timezone.now(),
        event_id=TASK_WAIT_ID,  # Ожидает задание
        shift_id=shift.id
    )
    return shift


def last_event(shift: Shifts) -> Event | Response:
    """Поиск последнего не закрытого события"""

    try:
        event = ShiftEvent.objects.filter(shift=shift, end_time__isnull=True).last()
    except Event.DoesNotExist:
        return Response({"error": "Cобытие не найдено"}, status=status.HTTP_204_NO_CONTENT)

    return event


def last_shift(tech: Tech) -> Shifts | Response:
    """Поиск последней не закрытой смены"""

    try:
        shift = Shifts.objects.filter(
            tech=tech
        ).last()
    except Shifts.DoesNotExist:
        return Response({"error": "Смена не найдена"}, status=status.HTTP_204_NO_CONTENT)

    return shift
