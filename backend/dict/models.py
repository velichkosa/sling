from django.db import models
from core.mixins import BaseUuidMixin, BaseTimestampedMixin


class Slings(BaseUuidMixin, BaseTimestampedMixin, models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="название")
    image = models.ImageField(verbose_name='Ссылка на изображение', upload_to='images/slings/')
    description = models.TextField(verbose_name="Описание")

    class Meta:
        ordering = ['name']
        verbose_name = "Вид стропы"
        verbose_name_plural = "Виды строп"

    def __str__(self):
        return self.name


class FormFactor(BaseUuidMixin, BaseTimestampedMixin, models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="название")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        ordering = ['name']
        verbose_name = "Форм-фактор груза"
        verbose_name_plural = "Форм-факторы груза"

    def __str__(self):
        return self.name


class WorkType(BaseUuidMixin, BaseTimestampedMixin, models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="название")
    description = models.TextField(verbose_name="Описание")

    class Meta:
        ordering = ['name']
        verbose_name = "Вид работы"
        verbose_name_plural = "Виды работ"

    def __str__(self):
        return self.name


class Tag(BaseUuidMixin, BaseTimestampedMixin, models.Model):
    name = models.CharField(verbose_name="название", max_length=255, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Тэг"
        verbose_name_plural = "Тэги"

    def __str__(self):
        return self.name
