from django.db import models
from core.mixins import BaseUuidMixin, BaseTimestampedMixin, nb_none


class Event(BaseUuidMixin, BaseTimestampedMixin):
    """
    Статус активности (например, Начал задание, Завершил задание).
    Это перечисление состояний, которые могут быть применены внутри смены.
    """
    name = models.CharField(verbose_name='Название', max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Справочник статусов'
        verbose_name_plural = 'Справочник статусов'
        ordering = ('name',)


class Org(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=50, unique=True)
    is_contractor = models.BooleanField(verbose_name='Является подрядчиком?', default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Справочник организаций'
        verbose_name_plural = 'Справочник организаций'
        ordering = ['name']


class Position(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=250, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Справочник должностей'
        verbose_name_plural = 'Справочник должностей'
        ordering = ['name']


class Parameters(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=255)

    class Meta:
        verbose_name = 'Справочник параметров'
        verbose_name_plural = 'Справочник параметров'
        ordering = ['name']

    def __str__(self):
        return f'{self.name}'


class EquipmentParameters(BaseUuidMixin, BaseTimestampedMixin):
    parameters = models.ForeignKey(Parameters,
                                   verbose_name='Параметр ',
                                   on_delete=models.CASCADE,
                                   related_name='equipment_parameters')
    value = models.IntegerField(verbose_name='Значение', **nb_none)

    class Meta:
        verbose_name = 'Справочник параметров оборудования'
        verbose_name_plural = 'Справочник параметров оборудования'
        ordering = ['parameters']

    def __str__(self):
        return f'{self.parameters}: {self.value}'


class LicenseCategories(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=10)
    description = models.CharField(verbose_name='Описание', max_length=255, **nb_none)

    class Meta:
        verbose_name = 'Справочник категорий ВУ'
        verbose_name_plural = 'Справочник категорий ВУ'
        ordering = ['name']

    def __str__(self):
        return self.name


class TechType(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=255)

    class Meta:
        verbose_name = 'Справочник типов техники'
        verbose_name_plural = 'Справочник типов техники'
        ordering = ['name']

    def __str__(self):
        return self.name


class TechStatus(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Состояние', max_length=255)

    class Meta:
        verbose_name = 'Справочник состояний техники'
        verbose_name_plural = 'Справочник состояний техники'
        ordering = ['name']

    def __str__(self):
        return self.name


class Location(BaseUuidMixin, BaseTimestampedMixin):
    name = models.CharField(verbose_name='Название', max_length=255)
    description = models.CharField(verbose_name='Описание', max_length=255, **nb_none)

    class Meta:
        verbose_name = 'Справочник локаций'
        verbose_name_plural = 'Справочник локаций'
        ordering = ['name']

    def __str__(self):
        return self.name
