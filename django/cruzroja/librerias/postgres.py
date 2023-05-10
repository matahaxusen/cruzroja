from api.models import Atendido, UserProfile

def lista_atendidos(email=False):
    if email:
        try:
            atendido = Atendido.objects.get(email=email)
            # Hacer algo con el registro encontrado, por ejemplo imprimirlo en la consola
            dic = {
                'nombre':atendido.nombre,
                'apellidos': atendido.apellidos,
                'email': atendido.email,
                'lugar_nacimiento': atendido.lugar_nacimiento,
                'casado': atendido.casado,
                'hijos': atendido.hijos,
                'fecha_nacimiento': atendido.fecha_nacimiento,
                'horario_contacto': atendido.horario_contacto
            }
            return dic
        except Atendido.DoesNotExist:
            # Manejar el caso en el que no se encuentra ningún registro con el correo electrónico dado
            print('No se encontró ningún atendido con ese correo electrónico')
    else:
        atendidos = Atendido.objects.all()
        ret = []
        for atendido in atendidos:
            dic = {
                'nombre':atendido.nombre,
                'apellidos': atendido.apellidos,
                'email': atendido.email,
                'lugar_nacimiento': atendido.lugar_nacimiento,
                'casado': atendido.casado,
                'hijos': atendido.hijos,
                'fecha_nacimiento': atendido.fecha_nacimiento,
                'horario_contacto': atendido.horario_contacto
            }
            ret.append(dic)
        return ret
    
def lista_usuarios(email=False):
    if email:
        try:
            usuario = UserProfile.objects.get(email=email)
            # Hacer algo con el registro encontrado, por ejemplo imprimirlo en la consola
            dic = {
                'username':usuario.user.username,
                'password': usuario.user.password,
                'email': usuario.user.email,
                'nombre': usuario.nombre,
                'apellidos': usuario.apellidos,
                'fecha_nacimiento': usuario.fecha_nacimiento
            }
            return dic
        except usuario.DoesNotExist:
            # Manejar el caso en el que no se encuentra ningún registro con el correo electrónico dado
            print('No se encontró ningún usuario con ese correo electrónico')
    else:
        usuarios = UserProfile.objects.all()
        ret = []
        for usuario in usuarios:
            dic = {
                'username':usuario.user.username,
                'password': usuario.user.password,
                'email': usuario.user.email,
                'nombre': usuario.nombre,
                'apellidos': usuario.apellidos,
                'fecha_nacimiento': usuario.fecha_nacimiento
            }
            ret.append(dic)
        return ret