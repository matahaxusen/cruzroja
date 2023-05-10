import './../../global.css';
import './unitarias.css';
import HeptagonalChart from './../radar/radar';
import PalabrasChart from './../palabras/palabras';
import { useState, useEffect } from 'react';
import UserSelect from './../../smartvoice/directo/userselect/userselect';
import Login from '../../privateroute/privateroute';

interface Ambitos {
  ambito_economico: string;
  ambito_familiar: string;
  ambito_ambiental: string;
  ambito_salud: string;
  ambito_personal: string;
  ambito_laboral: string;
  ambito_social: string;
}

interface Componente {
  transcripcion: string;
  palabras: string;
  ambitos: Ambitos;
}

interface Transcription {
  usuario: Record<string, any>;
  estadisticas_id: string;
  componentes: Componente[];
}

export const Unitarias = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
    };

  const [transcription, setTranscription] = useState<Transcription[]>([]);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAtendido, setSelectedAtendido] = useState('');
  const [users, setUsers] = useState([]);
  const [atendidos, setAtendidos] = useState([]);

  async function fetchUsers(): Promise<any> {
    const response = await fetch("http://localhost:8000/api/lista_usuarios/");
    const data = await response.json();
    return data;
  }

  async function fetchAtendidos(): Promise<any> {
    const response = await fetch("http://localhost:8000/api/lista_atendidos/");
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
    fetchAtendidos().then((data) => setAtendidos(data));
  }, []);

  useEffect(() => {
    async function fetchTranscription(email: string): Promise<any> {
      const response = await fetch(`http://localhost:8000/api/lista_estadisticas/?email=${JSON.parse(email).email}`);
      const data = await response.json();
      return data;
    }

    if (selectedAtendido) {
      fetchTranscription(selectedAtendido).then((data) => setTranscription(data.transcription));
    }
  }, [selectedAtendido]);

  const lastTranscription = transcription[transcription.length - 1];

  const palabras = JSON.parse(lastTranscription?.componentes[0]?.palabras || "[]");
  const ambitosData = Object.entries(lastTranscription?.componentes[0]?.ambitos || {}).map(([key, value]) => ({
    subject: key,
    value: value,
  }));

  //console.log(fetchTranscription)

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className='row'>
            <div className="form-group col-md-4 mt-3">
              <label htmlFor="atendido-select">Atendido:</label>
              <UserSelect users={atendidos} value={selectedAtendido} onSelect={(user) => setSelectedAtendido(user)} />
            </div>
          </div>
          {lastTranscription ? (
            <div className="card-group">
              <div className='col-lg-6 col-md-12'>
                <div className="my-card">
                  <div className="card-body">
                    <h5 className="card-title">Puntuación de necesidad en diferentes ámbitos</h5>
                    <HeptagonalChart data={ambitosData} />
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-12'>
                <div className="my-card">
                  <div className="card-body">
                    <h5 className="card-title">Estadísitcas en función de las palabras</h5>
                    <PalabrasChart palabras={palabras} />
                  </div>
                </div>
                <div className="my-card mt-3"> {/* Nueva tarjeta */}
                  <div className="card-body">
                    <h5 className="card-title">Transcripción</h5>
                    <p>{lastTranscription.componentes[0].transcripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>No se encontraron estadísticas para el atendido seleccionado. Por favor, elija otro atendido para mostrar las estadísticas.</p>
            </div>
          )}
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};
export default Unitarias;