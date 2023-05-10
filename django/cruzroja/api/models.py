from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    apellidos = models.CharField(max_length=100)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    @classmethod
    def insert_user_profile(self,username,email,password,nombre,apellidos,fecha_nacimiento):
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        profile = UserProfile(
            user=user,
            nombre=nombre,
            apellidos=apellidos,
            fecha_nacimiento=fecha_nacimiento,
        )
        profile.save()


class Atendido(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    lugar_nacimiento = models.CharField(max_length=100)
    casado = models.BooleanField()
    hijos = models.IntegerField()
    nacionalidad = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    horario_contacto = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"