import boto3, os, time, openai, tempfile
from botocore.session import Session
import requests
import json

openai.api_key=os.environ["OPENAI_KEY"]

#####################################################################################################
#                                                                                                   #
#                                      AWS CONNECTIONS                                              #
#                                                                                                   #
#####################################################################################################

def aws_client(tipo,region_name=os.environ['AWS_REGION_NAME']):
    s3 = boto3.client(tipo, 
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'], 
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        region_name=region_name
    )
    return s3

def aws_session(region_name=os.environ['AWS_REGION_NAME']):
    # Configura las credenciales y la región en las variables de entorno o en un archivo de configuración
    session = boto3.Session(
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'], 
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        region_name=region_name
    )
    return session

def connect_to_dynamodb(nombre_tabla):
    # Configura las credenciales y la región en las variables de entorno o en un archivo de configuración
    session = aws_session()

    # Crea una conexión a DynamoDB
    dynamodb = session.resource('dynamodb')

    # Obtén la tabla de DynamoDB que necesites (en este caso, la tabla 'mi_tabla')
    table = dynamodb.Table(nombre_tabla)

    return table

#####################################################################################################
#                                                                                                   #
#                                       AWS TRANSCRIPT                                              #
#                                                                                                   #
#####################################################################################################

def start_transcription_job(audio_file_uri):
    transcribe_client = aws_client('transcribe',region_name='eu-west-3')
    job_name = "transcription_job_" + str(hash(audio_file_uri))
    
    response = transcribe_client.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': audio_file_uri},
        MediaFormat=audio_file_uri.split('.')[-1],  # Ajusta este valor según el formato de tu archivo de audio
        LanguageCode='es-ES'  # Ajusta este valor según el idioma del audio
    )
    status = check_transcription_status(response['TranscriptionJob']['TranscriptionJobName'])
    return get_transcription_text(status['uri']), status['elapsed_time']


def check_transcription_status(job_name):
    transcribe_client = aws_client('transcribe',region_name='eu-west-3')
    start_time = time.time()  # Registra el tiempo actual

    while True:
        response = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
        status = response['TranscriptionJob']['TranscriptionJobStatus']
        print(status)
        if status == 'COMPLETED':
            end_time = time.time()  # Registra el tiempo actual
            elapsed_time = end_time - start_time  # Calcula el tiempo transcurrido
            return {
                'uri': response['TranscriptionJob']['Transcript']['TranscriptFileUri'],
                'elapsed_time': {
                    'tiempo_total': elapsed_time,
                    }
            }
        elif status == 'FAILED':
            raise Exception(f"Transcription job {job_name} failed.")
        
        time.sleep(3)  # Espera 3 segundos antes de verificar de nuevo

def get_transcription_text(transcript_uri):
    
    response = requests.get(transcript_uri)
    transcript = json.loads(response.text)
    return transcript['results']['transcripts'][0]['transcript']

def get_transcription_text(transcript_uri):
    response = requests.get(transcript_uri)
    transcript = json.loads(response.text)
    return transcript['results']['transcripts'][0]['transcript']

#####################################################################################################
#                                                                                                   #
#                                       AWS S3 BUCKET                                               #
#                                                                                                   #
#####################################################################################################

def upload_file_to_s3_path(bucket_name, file_path):
    file_name = file_path.split('/')[-1]
    s3 = aws_client('s3')
    s3.upload_file(file_path, bucket_name, file_name)

def download_file_from_s3_path(bucket_name, object_name, local_path):
    s3 = aws_client('s3')
    s3.download_file(bucket_name, object_name, local_path)

def upload_audio_to_s3_(bucket_name, audio_file):
    # Crea un archivo temporal para el archivo de audio
    with tempfile.NamedTemporaryFile(delete=False) as temp_audio_file:
        temp_audio_file.write(audio_file.read())
        temp_audio_file.seek(0)  # Restablecer la posición de lectura al principio del archivo

        # Sube el archivo al cubo S3
        s3 = boto3.client('s3', region_name='eu-west-3')
        original_file_name, file_extension = os.path.splitext(audio_file.name)
        timestamp = int(time.time())
        new_file_name = f'{original_file_name}_{timestamp}{file_extension}'
        s3.put_object(Bucket=bucket_name, Key=new_file_name, Body=open(temp_audio_file.name, 'rb'))

    # Elimina el archivo temporal después de cargarlo en S3
    os.unlink(temp_audio_file.name)

    # Genera una URL prefirmada para acceder al objeto S3
    object_url = f"s3://{bucket_name}/{new_file_name}"
    
    return object_url

def wait_for_s3_object(bucket_name, object_key):
    s3 = boto3.resource('s3', region_name='eu-west-3')
    obj = None
    while obj is None:
        try:
            obj = s3.Object(bucket_name, object_key).get()
        except s3.meta.client.exceptions.NoSuchKey:
            print(f'Objeto "{object_key}" aún no encontrado en el cubo "{bucket_name}". Esperando 3 segundos...')
            time.sleep(3)