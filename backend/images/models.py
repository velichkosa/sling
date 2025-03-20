from django.db import models

from core.mixins import BaseUuidMixin, BaseTimestampedMixin, nb_none
from dict.models import Tag, FormFactor, WorkType, Slings


class Image(BaseUuidMixin, BaseTimestampedMixin, models.Model):
    title = models.CharField(verbose_name='Название изображения', max_length=255)
    image = models.ImageField(verbose_name='Ссылка на изображение', upload_to='images/')
    description = models.TextField(verbose_name='Описание изображения', **nb_none)
    tags = models.ManyToManyField(Tag, verbose_name='Тэги', related_name='images', blank=True)
    form_factors = models.ManyToManyField(FormFactor, verbose_name='Форм-факторы', related_name='images', blank=True, )
    work_types = models.ManyToManyField(WorkType, verbose_name='Виды работ', related_name='images', blank=True, )
    approved_slings = models.ManyToManyField(Slings, related_name='images', verbose_name='Применяемые стропы')

    class Meta:
        ordering = ['title']
        verbose_name = "Схема строповки"
        verbose_name_plural = "Схемы строповки"

    def __str__(self):
        return self.title
