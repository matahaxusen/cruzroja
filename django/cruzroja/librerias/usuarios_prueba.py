from datetime import date
from api.models import UserProfile, Atendido

def mostrar_atendidos():
    atendidos = Atendido.objects.all()
    ret = []
    for atendido in atendidos:
        ret.append(atendido)
        print(atendido.id, atendido.nombre, atendido.apellidos, atendido.email)
    return ret


def generacion_usuarios():
    # Crear usuarios
    users_data = [
        {
            "username": "usuario1",
            "email": "usuario1@example.com",
            "password": "contraseña1",
            "nombre": "Juan",
            "apellidos": "Pérez",
            "fecha_nacimiento": date(1995, 2, 28),
        },
        {
            "username": "usuario2",
            "email": "usuario2@example.com",
            "password": "contraseña2",
            "nombre": "María",
            "apellidos": "García",
            "fecha_nacimiento": date(1988, 7, 12),
        },
        {
            "username": "usuario3",
            "email": "usuario3@example.com",
            "password": "contraseña3",
            "nombre": "Luis",
            "apellidos": "Martínez",
            "fecha_nacimiento": date(2000, 11, 5),
        },
        {
            "username": "usuario4",
            "email": "usuario4@example.com",
            "password": "contraseña4",
            "nombre": "Ana",
            "apellidos": "Fernández",
            "fecha_nacimiento": date(1993, 3, 23),
        },
        {
            "username": "usuario5",
            "email": "usuario5@example.com",
            "password": "contraseña5",
            "nombre": "Pedro",
            "apellidos": "Sánchez",
            "fecha_nacimiento": date(1985, 12, 8),
        },
    ]

    for user_data in users_data:
        UserProfile.insert_user_profile(**user_data)


    # Crear atendidos
    atendido1 = Atendido(
        nombre='Juan',
        apellidos='Pérez González',
        email='juanperez@gmail.com',
        lugar_nacimiento='Madrid, España',
        casado=False,
        hijos=0,
        nacionalidad='Española',
        fecha_nacimiento=date(1990, 1, 1),
        horario_contacto='mañanas'
    )
    atendido1.save()

    atendido2 = Atendido(
        nombre='María',
        apellidos='García López',
        email='mariagarcia@gmail.com',
        lugar_nacimiento='Barcelona, España',
        casado=True,
        hijos=2,
        nacionalidad='Española',
        fecha_nacimiento=date(1985, 6, 12),
        horario_contacto='tardes'
    )
    atendido2.save()

    atendido3 = Atendido(
        nombre='Pedro',
        apellidos='Hernández Ruiz',
        email='pedrohernandez@gmail.com',
        lugar_nacimiento='Sevilla, España',
        casado=True,
        hijos=1,
        nacionalidad='Española',
        fecha_nacimiento=date(1978, 9, 25),
        horario_contacto='noches'
    )
    atendido3.save()

    atendido4 = Atendido(
        nombre='Laura',
        apellidos='Martínez Sánchez',
        email='lauramartinez@gmail.com',
        lugar_nacimiento='Valencia, España',
        casado=False,
        hijos=0,
        nacionalidad='Española',
        fecha_nacimiento=date(1995, 4, 4),
        horario_contacto='mañanas'
    )
    atendido4.save()

    atendido5 = Atendido(
        nombre='Carlos',
        apellidos='Fernández García',
        email='carlosfernandez@gmail.com',
        lugar_nacimiento='Bilbao, España',
        casado=False,
        hijos=0,
        nacionalidad='Española',
        fecha_nacimiento=date(1988, 11, 17),
        horario_contacto='tardes'
    )
    atendido5.save()

    atendido6 = Atendido(
        nombre='Isabel',
        apellidos='López Rodríguez',
        email='isabellopez@gmail.com',
        lugar_nacimiento='Granada, España',
        casado=True,
        hijos=2,
        nacionalidad='Española',
        fecha_nacimiento=date(1972, 8, 8),
        horario_contacto='noches'
    )
    atendido6.save()