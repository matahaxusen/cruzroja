import openai

engines = {
    "ada": "ada",
    "3.5": "gpt-3.5-turbo",
    "4": "gpt-4",
}


finish_reason = {
    "stop": "API returned complete model output",
    "length": "Incomplete model output due to max_tokens parameter or token limit",
    "content_filter": "Omitted content due to a flag from our content filters",
    "null": "API response still in progress or incomplete"
}

formulario_json = {
    "ambito_personal": { #diccionario que contiene la informacion personal del atendido
        "nacionalidad":"Sobre su nacionalidad. ¿Tiene usted la nacionalidad española?",
        "empadronamiento":"¿Está usted empadronado/a en algún domicilio en España?",
        "estudios":"¿Tiene sus estudios homologados en España?"
    },
    "ambito_economico":{ #diccionario que contiene la informacion economica del atendido
        "ingresos":"Tienen ingresos usted y su unidad de convivencia?",
        "equipamiento_hogar": "Ahora le voy a preguntar sobre el equipamiento de su hogar, por ejemplo, los electrodomésticos que tiene...",
        "retrasos_pagos":"Dígame si ha tenido retrasos en el pago de gastos relacionados con la vivienda principal (hipoteca o alquiler, recibos de gas, comunidad, etc) o en compras a plazos en los últimos meses"
    },
    "ambito_laboral":{ #diccionario que contiene la informacion laboral del atendido
        "encontrar_empleo":"Entra en sus planes encontrar empleo o mejorar su situación laboral?"
    },
    "ambito_familiar":{ #diccionario que contiene la informacion familiar del atendido
        "personas_al_cargo":"Cuántas personas mayores de 16 años pertenecen a su unidad de convivencia?",
        "tiempo_dedicado": "Dedica usted parte de su tiempo al cuidado de familiares?",
        "clima_familiar": "Cómo considera el clima familiar en su casa?"
    },
    "ambito_ambiental": { #diccionario que contiene la informacion ambiental del atendido
        "vivienda":"Tiene usted un lugar en el que vivir?",
        "adaptacion_vivienda":"Cree usted que su vivienda está adaptada a sus necesidades?"
    },
    "ambito_salud":{ #diccionario que contiene la informacion de salud del atendido
        "ambitos:inadecuados":"Cree usted, o le han comentado alguna vez, que tiene hábitos inadecuados de salud o conductas de riesgo?",
        "estado_salud": "Cómo valora la persona su estado de salud en los últimos seis meses?"
    },
    "ambito_social": { #diccionario que contiene la informacion social del atendido
        "discriminacion":"Considera usted que en algún momento ha sufrido discriminación o un trato desigual?",
        "red_apoyo":"Tiene usted redes de apoyo estables?"
    }
}

class OpenAIObject:

    def __init__(self, engine):
        openai.api_key = "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"
        self.engine = engine
        self.conversations = []
        self.logs = []

    def chatgpt_conversation(self, prompt):
        self.conversations.append({'role': 'user', 'content': prompt})
        response = openai.ChatCompletion.create(
            model = self.engine,
            messages = self.conversations
        )

        self.conversations.append({
            'role': response.choices[0].message.role, 
            'content': response.choices[0].message.content.strip()
        })
        self.logs.append(response)
        print(response)
        return response["choices"][0]["message"]["content"]
    
    def preguntas_cruz_roja(self, transcripcion_atendido):
        ret = []
        for key,value in formulario_json.items():
            for focus_key, focus_value in value.items():
                ret.append(focus_value)

        entrada_mensajes = [{"role": "system", "content": f"Devuelve texto solo respondiendo a las preguntas con el contenido de el texto con triples comillas, si no aparece en el texto responde diciendo que no se encuentra '''{transcripcion_atendido}'''. "}]
        
        preguntas = "Preguntas contenidas en las cuadruples comillas:\n"
        for i in range(len(ret)):
            print(ret [i])
            preguntas += f"''''Pregunta{i}: {ret[i]}''''\n"

        print(preguntas)
        entrada_mensajes.append({"role": "user", "content": f"{preguntas}"})

        respuesta_api = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=entrada_mensajes,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.7,
        )

        #respuestas = [choice.message['content'] for choice in respuesta_api.choices[0].message['choices']]          
        return respuesta_api["choices"][0]["message"]["content"]
    
    def ambitos_texto(self, transcripcion_atendido):
        ambitos = [
            '1: Ámbito Personal.\n',
            '2: Ámbito Económico.\n',
            '3: Ámbito Laboral.\n',
            '4: Ámbito Familiar.\n',
            '5: Ámbito Ambiental y de vivienda.\n',
            '6: Ámbito de la Salud.\n',
            '7: Ámbito Social.\n',
        ]

        entrada_mensajes = []

        entrada_mensajes = [{"role": "system", "content": f"Eres un profesional en puntuar del 1 al 10 el grado de necesidad de ayuda de la Cruz Roja (1 sería nada de necesidad, 10 seria mucha necesidad) en los ambitos entre comillas triples '''{''.join( str(x) for x in ambitos)}'''"}]
        entrada_mensajes.append({"role": "user", "content": f"Dame una lista puntuando el grado de necesidad de el contenido entre triples comillas y responde solo con la lista: '''{transcripcion_atendido}'''"})

        respuesta_api = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=entrada_mensajes,
            max_tokens=300,
            n=1,
            stop=None,
            temperature=0.7,
        )

        try:
            ambito = respuesta_api["choices"][0]["message"]["content"]
            ambito = ambito.split('\n')
            for j in range(len(ambito)):
                ambito[j] = ambito[j].split(' ')[len(ambito[j].split(' '))-1]
            ambito = {
                "ambito_personal": ambito[0],
                "ambito_economico": ambito[1],
                "ambito_laboral": ambito[2],
                "ambito_familiar": ambito[3],
                "ambito_ambiental": ambito[4],
                "ambito_salud": ambito[5],
                "ambito_social": ambito[6]
            }
        except:
            ambito = 'No se ha proporcionado suficiente informacion para cumplir con los ambitos requeridos'

        #respuestas = [choice.message['content'] for choice in respuesta_api.choices[0].message['choices']]          
        return ambito
    
    def emociones_texto(self, transcripcion_atendido):
        entrada_mensajes = []

        entrada_mensajes = [{"role": "system", "content": f"Eres un profesional en analizar la frecuencia de aparición de palabras en las transcripciones de la Cruz Roja"}]
        entrada_mensajes.append({"role": "user", "content": f"Dame una lista con la freuencia de aparicion de las 10 palabras relevantes que mas aparecen en el contenido entre triples comillas y responde solo con la lista: '''{transcripcion_atendido}'''"})

        respuesta_api = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=entrada_mensajes,
            max_tokens=300,
            n=1,
            stop=None,
            temperature=0.9,
        )

        emocion = respuesta_api["choices"][0]["message"]["content"]

        #respuestas = [choice.message['content'] for choice in respuesta_api.choices[0].message['choices']]          
        return emocion