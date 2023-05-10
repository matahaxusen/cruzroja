import boto3, uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key, Attr

def add_item_to_table(table, item_data):
    # Añade un nuevo ítem a la tabla
    response = table.put_item(
        Item=item_data
    )

    return response

def add_conversation(table, user_id, atendido_id, audio_s3_uri, transcript, preguntas):
    response = table.put_item(
        Item={
            'conversacion_id': str(uuid.uuid4()),
            'usuario': user_id,
            'atendido': atendido_id,
            'componentes': [
                {
                    'timestamp': datetime.now().isoformat(),
                    'audio_s3_uri': audio_s3_uri,
                    'transcripcion': transcript,
                    'preguntas': preguntas
                }
            ]
        }
    )
    print(response)
    return response

def add_estadistica(table, user_id, transcript, ambitos, palabras):

    borrar_estadistica(table, user_id['email'])

    # Agregar nuevo registro
    response = table.put_item(
        Item={
            'estadisticas_id': str(uuid.uuid4()),
            'usuario': user_id,
            'componentes': [
                {
                    'transcripcion': transcript,
                    'ambitos': ambitos,
                    'palabras': palabras
                }
            ]
        }
    )
    return response

def borrar_estadistica(table,email):
# Eliminar registro anterior con mismo usuario
    response = table.scan(
        FilterExpression=Attr('usuario.email').eq(email)
    )

    for item in response['Items']:
        print(item)
        table.delete_item(
            Key={
                'estadisticas_id': item['estadisticas_id']
            }
        )

def obtener_conversaciones(table):
    return table.scan()['Items']

def obtener_estadisticas(table):
    return table.scan()['Items']