# Generated by Django 5.1.2 on 2025-03-21 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0002_image_approved_slings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.ImageField(upload_to='images/sling_schemes/', verbose_name='Ссылка на изображение'),
        ),
    ]
