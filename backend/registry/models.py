from django.db import models
from core.mixins import BaseUuidMixin, BaseTimestampedMixin, nb_none
from dict.models import EquipmentParameters, LicenseCategories, Event
from core.mixins import BaseUuidMixin, BaseTimestampedMixin
from dict.models import TechType, TechStatus, Location
from users.models import Org


class Operator(BaseUuidMixin, BaseTimestampedMixin):
    first_name = models.CharField(verbose_name='Имя', max_length=255)
    last_name = models.CharField(verbose_name='Фамилия', max_length=255)
    org = models.ForeignKey(
        Org,
        verbose_name='Организация',
        related_name='operators',
        on_delete=models.CASCADE
    )
    phone_number = models.BigIntegerField(verbose_name='Номер телефона', **nb_none)
    experience = models.IntegerField(verbose_name='Опыт работы (лет)', **nb_none)
    license_categories = models.ManyToManyField(
        LicenseCategories,
        verbose_name='Категории водительских удостоверений',
        related_name='operators'
    )

    class Meta:
        verbose_name = 'Оператор СПТ'
        verbose_name_plural = 'Операторы СПТ'
        ordering = ['last_name']

    def __str__(self):
        return f'{self.last_name} {self.first_name}'


class Equipment(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=255, unique=True)
    parameters = models.ManyToManyField(
        EquipmentParameters,
        verbose_name='Параметры оборудования',
        related_name='equipment_types'
    )

    class Meta:
        verbose_name = 'Оборудование'
        verbose_name_plural = 'Оборудование'
        ordering = ['name']

    def __str__(self):
        # Получаем параметры оборудования и выводим их в строку
        params = ", ".join([str(param) for param in self.parameters.all()])
        return f"{self.name} ({params})"


class Tech(BaseUuidMixin, BaseTimestampedMixin):
    gos_num = models.CharField(verbose_name='Гос. номер', unique=True, max_length=9)
    type = models.ForeignKey(
        TechType,
        verbose_name='Тип техники',
        on_delete=models.CASCADE
    )
    status = models.ForeignKey(
        TechStatus,
        verbose_name='Состояние техники',
        on_delete=models.CASCADE
    )
    home_location = models.ForeignKey(
        Location,
        verbose_name='Базовая локация',
        on_delete=models.CASCADE
    )
    org = models.ForeignKey(
        Org,
        verbose_name='Организация',
        related_name='techs',
        on_delete=models.CASCADE
    )
    equipment = models.ManyToManyField(
        Equipment,
        verbose_name='Оборудование',
        related_name='techs'
    )

    is_active = models.BooleanField(verbose_name='Активна', default=True)

    class Meta:
        verbose_name = 'Техника'
        verbose_name_plural = 'Техника'
        ordering = ['type']

    def __str__(self):
        return f'{self.gos_num} ({self.type})'


class Shifts(BaseUuidMixin, BaseTimestampedMixin):
    tech = models.ForeignKey(
        Tech,
        verbose_name='Техника',
        on_delete=models.CASCADE,
        related_name='shifts'
    )
    # operator = models.ForeignKey(
    #     Operator,
    #     verbose_name='Оператор',
    #     on_delete=models.CASCADE,
    #     related_name='shifts'
    # )
    start_time = models.DateTimeField(verbose_name='Начало смены')
    end_time = models.DateTimeField(verbose_name='Окончание смены', **nb_none)

    def __str__(self):
        return f"Смена {self.tech} ({self.start_time} - {self.end_time})"

    class Meta:
        verbose_name = 'Журнал смен'
        verbose_name_plural = 'Журналы смен'
        ordering = ('start_time',)


class ShiftEvent(BaseUuidMixin, BaseTimestampedMixin):
    """
        Модель для записи действий/событий внутри смены.
        Например, начало задания, завершение задания.
    """
    shift = models.ForeignKey(
        Shifts,
        verbose_name='Смена',
        on_delete=models.CASCADE,
        related_name='shift'
    )
    event = models.ForeignKey(
        Event,
        verbose_name='Состояние',
        on_delete=models.CASCADE,
        related_name='shift_event'
    )
    start_time = models.DateTimeField(verbose_name='Начало состояния')
    end_time = models.DateTimeField(verbose_name='Окончание состояния', **nb_none)
    confirmation = models.BooleanField('Подтверждение', default=False)

    def __str__(self):
        return f"{self.event} для смены {self.shift} ({self.start_time} - {self.end_time})"

    class Meta:
        verbose_name = 'Детализация смен'
        verbose_name_plural = 'Детализация смен'
        ordering = ('start_time',)


class VwShiftSummary(models.Model):
    id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField(verbose_name='Начало смены')
    finish_time = models.DateTimeField(verbose_name='Окончание смены')
    shift_duration_seconds = models.FloatField(verbose_name='Продолжительность смены (в секундах)')
    tech_gos_number = models.CharField(max_length=9, verbose_name='Гос. номер техники')
    tech_type = models.CharField(max_length=255, verbose_name='Тип техники')
    tech_status = models.CharField(max_length=255, verbose_name='Состояние техники')
    org = models.CharField(max_length=255, verbose_name='Организация')
    event = models.ForeignKey(ShiftEvent, on_delete=models.CASCADE)
    event_name = models.CharField(max_length=255, verbose_name='Название события')
    event_confirmation = models.BooleanField(verbose_name='Подтверждение события')
    event_start_time = models.DateTimeField(verbose_name='Время начала события')
    event_finish_time = models.DateTimeField(null=True, blank=True, verbose_name='Время окончания события')
    event_duration_seconds = models.FloatField(verbose_name='Продолжительность события (в секундах)')
    equipment_details = models.TextField(verbose_name='Детали оборудования')

    class Meta:
        managed = False
        db_table = 'vw_shift_summary'  # Имя представления в базе данных
        verbose_name = 'Сводка смен'
        verbose_name_plural = 'Сводки смен'
