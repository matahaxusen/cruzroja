import React, { useState, useEffect } from 'react';
import './../../global.css';
import './multiusuario.css'
import UserSelect from './../../smartvoice/directo/userselect/userselect';
import Login from '../../privateroute/privateroute';

interface Atendido {
  email: string;
}

interface ConversacionComponente {
  preguntas: string;
  transcripcion: string;
}

interface Conversacion {
  componentes: ConversacionComponente[];
}

export const Multiusuario = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };

  const [atendidos, setAtendidos] = useState<Atendido[]>([]);
  const [selectedAtendido, setSelectedAtendido] = useState('');
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/lista_atendidos/')
      .then((response) => response.json())
      .then((data) => setAtendidos(data));
  }, []);

  useEffect(() => {
    if (selectedAtendido) {
      fetch(`http://localhost:8000/api/lista_conversaciones/?email=${JSON.parse(selectedAtendido).email}`)
        .then((response) => response.json())
        .then((data) => setConversaciones(data.transcription));
    }
  }, [selectedAtendido]);

  const latestConversacion = conversaciones[conversaciones.length - 1];

  const lineas = latestConversacion?.componentes[0]?.preguntas.split("\n").map((linea, index) => (
    <p key={index}>{linea}</p>
  ));


  return (
    <div>
    {isLoggedIn ? (
    <>
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="atendido-select">Atendido:</label>
          <UserSelect users={atendidos} value={selectedAtendido} onSelect={(user) => setSelectedAtendido(user)} />
        </div>
      </div>
      {latestConversacion ? (
        <div className="card-group">
          <div className="col-md-12 col-lg-6">
            <div className="my-card">
              <div className="card-body">
                <h5 className="card-title">Preguntas</h5>
                <p>{lineas}</p>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-6">
            <div className="my-card">
              <div className="card-body">
                <h5 className="card-title">Transcripción</h5>
                <p>{latestConversacion.componentes[0].transcripcion}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>No se encontraron conversaciones para el atendido seleccionado. Por favor, elija otro atendido para mostrar las conversaciones.</p>
        </div>
      )}
      </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default Multiusuario;