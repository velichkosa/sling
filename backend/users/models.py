from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower

from django.utils.translation import gettext_lazy as _

from core.mixins import BaseTimestampedMixin, BaseUuidMixin, nb_none
from dict.models import Position, Org


class Users(BaseUuidMixin, BaseTimestampedMixin, AbstractUser):
    first_name = models.CharField(verbose_name='Имя', max_length=50, unique=False, **nb_none)
    last_name = models.CharField(verbose_name='Фамилия', max_length=50, unique=False, **nb_none)
    username = models.CharField(verbose_name='Имя пользователя', max_length=50, unique=True)
    org = models.ForeignKey(
        Org,
        verbose_name='Организация',
        on_delete=models.CASCADE,
        **nb_none
    )
    position = models.ForeignKey(
        Position,
        verbose_name='Должность',
        on_delete=models.CASCADE,
        **nb_none
    )
    role = models.ForeignKey(
        Group,
        verbose_name='Роль',
        related_name='user_role',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
    email = models.EmailField(
        verbose_name='Электронная почта',
        unique=True,
        error_messages={"unique": _("Пользователь с таким адресом уже существует.")},
        **nb_none
    )
    phone = models.BigIntegerField(
        verbose_name='Номер телефона',
        unique=True,
        **nb_none
    )

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username or self.email or str(self.id)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() if self.first_name or self.last_name else None

    def get_short_name(self):
        return self.first_name or self.username

    def clean(self):
        super().clean()
        if self.email:
            self.email = self.email.lower()

    class Meta:
        constraints = [
            UniqueConstraint(
                Lower("email"),
                name="user_email_ci_uniqueness",
            ),
        ]
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['username']
