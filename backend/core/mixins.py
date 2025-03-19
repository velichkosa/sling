import uuid

from django.db import models

nb = dict(null=True, blank=True)
nb_none = dict(null=True, blank=True, default=None)


class BaseUuidMixin(models.Model):
    id = models.UUIDField('ИД', primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class BaseCreatedAtMixin(models.Model):
    created_at = models.DateTimeField('создан в', auto_now_add=True)

    class Meta:
        abstract = True


class BaseTimestampedMixin(BaseCreatedAtMixin):
    updated_at = models.DateTimeField('изменен в', auto_now=True)

    class Meta:
        abstract = True
