from pyspark.sql.functions import lower, explode, split, regexp_replace, col
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType, StructType, StructField
import pandas as pd
import nltk
from nltk.corpus import stopwords

def filtrar_palabras_relevantes(df, stopwords_esp):
        # Filtrar las palabras vacías
        df_relevantes = df.filter(~col("palabra").isin(stopwords_esp))
        
        return df_relevantes

def contar_palabras_texto(texto, filtrar_por_frecuencia=False):
    spark = SparkSession.builder.getOrCreate()
    sc = spark.sparkContext
    # Crear un RDD a partir del texto
    rdd_texto = sc.parallelize([{'texto': texto}])
    
    # Convertir el RDD en un DataFrame y especificar el esquema
    schema = StructType([StructField("texto", StringType(), True)])
    df_texto = rdd_texto.toDF(schema)
    
    # Limpiar el texto
    df_texto = df_texto.withColumn("texto_limpio", regexp_replace(lower(df_texto["texto"]), "[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]", ""))

    
    # Dividir el texto en palabras
    df_texto = df_texto.withColumn("palabras", split(df_texto["texto_limpio"], "\\s+"))
    
    # Explotar las palabras para crear una fila para cada palabra
    df_palabras = df_texto.select(explode(df_texto["palabras"]).alias("palabra"))
    
    # Contar la frecuencia de cada palabra y ordenar por frecuencia descendente
    df_frecuencia = df_palabras.groupBy("palabra").count().orderBy("count", ascending=False)

    nltk.download("stopwords")

    # Carga las palabras vacías en español
    stopwords_esp = stopwords.words("spanish")

    # Filtrar palabras relevantes
    df_palabras_relevantes = filtrar_palabras_relevantes(df_frecuencia,stopwords_esp)

    # Filtrar palabras con frecuencia mayor a 2 si filtrar_por_frecuencia es True
    if filtrar_por_frecuencia:
        df_palabras_relevantes = df_palabras_relevantes.filter(col("count") >= filtrar_por_frecuencia)

    # Convertir el DataFrame a JSON
    json_palabras_relevantes = df_palabras_relevantes.toPandas().to_json(orient="records")

    # Devolver el JSON de palabras relevantes
    return json_palabras_relevantes

