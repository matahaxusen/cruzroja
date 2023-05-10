import json
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from librerias import aws, openai, dynamodb, usuarios_prueba, postgres, pyspark
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token

bucket_name = 'cruzroja-hackaton-s3-elitaprojects'
west_s3 = 'cruzroja-hackaton-recorfiles'
gpt_transcribe = 'Corrige de forma gramatical y ortográfica el texto entre triples comillas::\n'

@login_required
def url_list(request):
    #aws.upload_file_to_s3(bucket_name, '/home/matahaxusen/Documentos/Cruz-Roja/react/cruzroja/src/logo.svg')
    #aws.download_file_from_s3(bucket_name,'logo.svg','/home/matahaxusen/Documentos/Cruz-Roja/react/cruzroja/src/logo1.svg')
    audio_file_uri = 's3://cruzroja-hackaton-recorfiles/audio_1683024448.ogg'
    transcription_text, transcription_log = aws.start_transcription_job(audio_file_uri)
    print(f'Log de la carga de audio en tgranscript:\n{transcription_log}\nTexto obtenido por AWS:\n{transcription_text}')
    print("ChatGPT3.5 entrando en juego...")
    gpt_openai = openai.OpenAIObject("gpt-3.5-turbo")
    gptext = gpt_openai.chatgpt_conversation(f"{gpt_transcribe}'''{transcription_text}'''")    
    dynamodb.add_conversation(aws.connect_to_dynamodb('cruzroja-conversaciones'),'1000134',audio_file_uri,transcription_text,gptext)
    return JsonResponse({'transcription': gptext})
    #return HttpResponse(str(transcribe))

@csrf_exempt
def lista_estadisticas(request):
    email = request.GET.get('email', None)
    estadisticas = dynamodb.obtener_estadisticas(aws.connect_to_dynamodb('cruzroja-estadisticas'))
    if email is not None:
        estadisticas = [estadistica for estadistica in estadisticas if estadistica['usuario']['email'] == email]
    return JsonResponse({'transcription': estadisticas})

@csrf_exempt
def lista_conversaciones(request):
    email = request.GET.get('email', None)
    conversaciones = dynamodb.obtener_conversaciones(aws.connect_to_dynamodb('cruzroja-conversaciones'))
    if email is not None:
        conversaciones = [estadistica for estadistica in conversaciones if estadistica['atendido']['email'] == email]
    return JsonResponse({'transcription': conversaciones})

@login_required
def cargar_usuarios_prueba(request):
    return JsonResponse({'diccionario':str(usuarios_prueba.mostrar_atendidos())})

def pruebas_locas(request):
    dynamodb.borrar_estadistica(aws.connect_to_dynamodb('cruzroja-estadisticas'))
    return JsonResponse({'respuesta':'done'})

@csrf_exempt
def cargar_audio(request):
    if request.method == 'POST':
        print('Iniciando proceso de transcripción y correcion de audios')
        audio_file = request.FILES.get('audio')
        selected_user_email = json.loads(request.POST['selectedUserEmail'])
        info_atendido = json.loads(request.POST['selectedAtendidoEmail'])
        if audio_file:
            info_user={
                'nombre': selected_user_email["nombre"],
                'apellidos': selected_user_email["apellidos"],
                'email': selected_user_email["email"]
            }
            print(info_user,info_atendido)
            # Cargar archivo en el cubo S3
            print('Iniciando carga de archivo de audio en el cubo de s3')
            uri_s3 = aws.upload_audio_to_s3_(west_s3, audio_file)

            # Esperar a que se cargue el archivo en el cubo S3
            object_key = uri_s3.split('/')[-1]
            print('Esperando a que se cargue el archivo en el cubo s3') 
            aws.wait_for_s3_object(west_s3, object_key)

            # Iniciar el trabajo de transcripción
            print('Iniciando el proceso de transcipción')
            transcription_text, transcription_log = aws.start_transcription_job(uri_s3)

            # Realizar análisis de texto
            gpt_openai = openai.OpenAIObject("gpt-3.5-turbo")
            print('Aplicando inteligencia artifical para la correción gramatical del texto')
            gptext = gpt_openai.chatgpt_conversation(f"{gpt_transcribe}'''{transcription_text}'''")
            analytics = gpt_openai.preguntas_cruz_roja(gptext)   
            # Agregar conversación a DynamoDB
            dynamodb.add_conversation(aws.connect_to_dynamodb('cruzroja-conversaciones'), info_user, info_atendido, uri_s3, gptext, analytics)
            ambito = gpt_openai.ambitos_texto(gptext)
            repeticiones = pyspark.contar_palabras_texto(gptext)
            dynamodb.add_estadistica(aws.connect_to_dynamodb('cruzroja-estadisticas'),info_atendido,gptext,ambito,repeticiones)
            # Devolver la transcripción como respuesta a la solicitud
            return JsonResponse({'transcription': gptext,'analytics': analytics})
        else:
            return JsonResponse({'error': 'No se recibió ningún archivo de audio'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not (username and password):
            return JsonResponse({'error': 'Faltan campos requeridos'}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key})
        else:
            return JsonResponse({'error': 'Credenciales incorrectas'}, status=401)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    

def lista_atendidos(request):
    return JsonResponse(postgres.lista_atendidos(), safe=False)

def lista_usuarios(request):
    return JsonResponse(postgres.lista_usuarios(), safe=False)

def buscar_atendido(request):
    return JsonResponse(postgres.lista_atendidos(email='juanperez@gmail.com'), safe=False)