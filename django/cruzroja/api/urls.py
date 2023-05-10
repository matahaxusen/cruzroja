"""
URL configuration for cruzroja project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.url_list, name='url_list'),
    path('cargar_audio/', views.cargar_audio, name='cargar_audio'),
    path('login/', views.login, name='login'),
    path('lista_atendidos/', views.lista_atendidos, name='lista_atendidos'),
    path('lista_usuarios/', views.lista_usuarios, name='lista_usuarios'),
    path('lista_estadisticas/', views.lista_estadisticas, name='lista_estadisticas'),
    path('lista_conversaciones/', views.lista_conversaciones, name='lista_conversaciones'),
    path('pruebas_locas/', views.pruebas_locas, name='pruebas_locas'),
    path('buscar_atendido/', views.buscar_atendido, name='buscar_atendido'),
    path('database/cargar_usuarios/DoAz8ha64lHTT1JT4RqcBLJfNIYegHC4/', views.cargar_usuarios_prueba, name='cargar_usuarios_prueba'),
]
