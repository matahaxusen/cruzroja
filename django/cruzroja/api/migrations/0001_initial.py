# Generated by Django 4.2 on 2023-05-02 17:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Atendido',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('apellidos', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('lugar_nacimiento', models.CharField(max_length=100)),
                ('casado', models.BooleanField()),
                ('hijos', models.IntegerField()),
                ('nacionalidad', models.CharField(max_length=100)),
                ('fecha_nacimiento', models.DateField()),
                ('horario_contacto', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('nombre', models.CharField(max_length=100)),
                ('fecha_nacimiento', models.DateField()),
                ('apellidos', models.CharField(max_length=100)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
