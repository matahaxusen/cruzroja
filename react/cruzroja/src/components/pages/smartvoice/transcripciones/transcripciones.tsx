import React from 'react';
import { useState, useEffect } from 'react';
import './../../global.css';
import './../directo/directo.css';
import './../directo/recordbtn/recordbtn.css'
import Login from '../../privateroute/privateroute';
import UserSelect from './../directo/userselect/userselect';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Transcripciones = () => {
    const [audioFile, setAudioFile] = useState<Blob | null>(null);
    const [sending, setSending] = useState<boolean>(false);
    const [mimeType, setMimeType] = useState<string>('');

    const [transcription, setTranscription] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAudioFile(file);
      setMimeType(file.type);
    }
  };

  const handleSendAudio = async () => {
    if (!audioFile || sending) return; // No envía si no hay audio o se está enviando
    setSending(true);
  
    const formData = new FormData();
    const fileExtension = mimeType.split('/')[1] || 'unknown';
    formData.append('audio', audioFile, `audio.${fileExtension}`);
    formData.append('selectedUserEmail', selectedUser);
    formData.append('selectedAtendidoEmail', selectedAtendido);
    console.log(`audio.${fileExtension}`);
    console.log(selectedUser);
  
    try {
      const response = await fetch('http://localhost:8000/api/cargar_audio/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      setTranscription(data.transcription);
      setAnalytics(data.analytics);
      console.log('Audio enviado:', audioFile);
    } catch (error) {
      console.error('Error al enviar el audio:', error);
    } finally {
      setSending(false);
    }
  };


  return (
    <div>
      {isLoggedIn ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card my-card">
                <div className="card-body">
                  <h5 className="card-title">Subida de audio</h5>
                  <div className='form'>
                  <div className="form-group mt-4">
                      <label htmlFor="user-select">Usuario:</label>
                      <UserSelect users={users} value={selectedUser} onSelect={(user) => setSelectedUser(user)} />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="atendido-select">Atendido:</label>
                      <UserSelect users={atendidos} value={selectedAtendido} onSelect={(atendido) => setSelectedAtendido(atendido)} />
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                        <label htmlFor="audio-file" className="form-label">Archivo de audio:</label>
                        <input
                            type="file"
                            id="audio-file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                    <button
                          className="custom-btn"
                          onClick={handleSendAudio}
                          disabled={!audioFile || !selectedUser || selectedUser === '' || !selectedAtendido || selectedAtendido === ''}// Desactiva el botón si no hay audio
                        >
                          <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                              <svg
                                height="24"
                                width="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path
                                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <span>Send</span>
                        </button>
                    </div>
                  </div>
                </div>
                <div className='text-center'>
                    {((!selectedUser || !selectedAtendido) && audioFile) && (
                        <p className="warning-text">Por favor, seleccione un usuario y un atendido antes de enviar el mensaje.</p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-md-8">
                <div className="card my-card">
                    <div className="card-body">
                    <h5 className="card-title">Información</h5>
                    <div className="row">
                      <div className="col-md-12">
                        <p>{transcription ||  'La transcripcion del audio se mostrará aqui despues de ser enviada al servidor'}</p>
                      </div>
                      <div className="col-md-12">
                        <p>{analytics ||  'Aqui se va a mostrar la información procesada por la IA y los diferentes analisis que se hagan sobre el texto'}</p>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
      <Login onLoginSuccess={handleLoginSuccess} />
    )}
  </div>
  );
};
