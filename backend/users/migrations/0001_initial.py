# Generated by Django 5.1.2 on 2025-01-17 10:19

import django.contrib.auth.models
import django.db.models.deletion
import django.db.models.functions.text
import django.utils.timezone
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('dict', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ИД')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='создан в')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='изменен в')),
                ('first_name', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='Имя')),
                ('last_name', models.CharField(blank=True, default=None, max_length=50, null=True, verbose_name='Фамилия')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='Имя пользователя')),
                ('email', models.EmailField(blank=True, default=None, error_messages={'unique': 'Пользователь с таким адресом уже существует.'}, max_length=254, null=True, unique=True, verbose_name='Электронная почта')),
                ('phone', models.BigIntegerField(blank=True, default=None, null=True, unique=True, verbose_name='Номер телефона')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('org', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='dict.org', verbose_name='Организация')),
                ('position', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='dict.position', verbose_name='Должность')),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_role', to='auth.group', verbose_name='Роль')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Пользователь',
                'verbose_name_plural': 'Пользователи',
                'ordering': ['username'],
                'constraints': [models.UniqueConstraint(django.db.models.functions.text.Lower('email'), name='user_email_ci_uniqueness')],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
