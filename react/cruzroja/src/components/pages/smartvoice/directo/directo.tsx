import { useState, useRef, useEffect } from 'react';
import './../../global.css';
import './directo.css';
import './recordbtn/recordbtn.css'
import Login from '../../privateroute/privateroute';
import UserSelect from './userselect/userselect';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Directo = () => {
    const [recording, setRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [audioFile, setAudioFile] = useState<Blob | null>(null);
    const [sending, setSending] = useState<boolean>(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const Preloader = () => (
      <div className="preloader">
        <div className="spinner"></div>
      </div>
    );
  
    useEffect(() => {
      if (recording) {
        timerRef.current = setInterval(() => {
          setElapsedTime((time) => time + 1);
        }, 1000);
      } else {
        clearInterval(timerRef.current as NodeJS.Timeout);
        setElapsedTime(0);
      }
  
      return () => {
        clearInterval(timerRef.current as NodeJS.Timeout);
      };
    }, [recording]);

    const [mimeType, setMimeType] = useState<string>('');

    const handleRecord = async () => {
        if (!recording) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/ogg' });
          mediaRecorderRef.current = mediaRecorder;
          setMimeType(mediaRecorder.mimeType); // Actualiza el mimeType
          mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
          mediaRecorder.start();
          setRecording(true);
        } else {
          mediaRecorderRef.current?.stop();
          setRecording(false);
        }
      };

    const [transcription, setTranscription] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<string | null>(null);

    const displayStatusMessage = async (message: string, duration: number) => {
      setStatusMessage(message);
      await new Promise((resolve) => setTimeout(resolve, duration));
    };
    
    const handleSendAudio = async () => {
      setSending(true);
      setIsLoading(true);
      setTranscription(null);
      setAnalytics(null);
    
      setTimeout(() => setStatusMessage('Iniciando carga de archivo de audio en el cubo de s3'), 0);
      setTimeout(() => setStatusMessage('Esperando a que se cargue el archivo en el cubo s3'), 8000);
      setTimeout(() => setStatusMessage('Iniciando el proceso de transcipción'), 12000);
      setTimeout(() => setStatusMessage('Aplicando inteligencia artifical para la correción gramatical del texto'), 15000);
    
      try {
        if (!audioFile || recording) return;
    
        const formData = new FormData();
        const fileExtension = mimeType.split('/')[1] || 'unknown';
        formData.append('audio', audioFile, `audio.${fileExtension}`);
        formData.append('selectedUserEmail', selectedUser);
        formData.append('selectedAtendidoEmail', selectedAtendido);
    
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
        // Oculta los mensajes de estado y el preloader
        setSending(false);
        setIsLoading(false);
        setStatusMessage(null);
      }
    };
    
    
    
    const [startSending, setStartSending] = useState(false);
    
    const handleSendButtonClick = () => {
      setStartSending(true);
      handleSendAudio();
    };    

  const handleDataAvailable = (event: BlobEvent) => {
    const newAudioURL = URL.createObjectURL(event.data);
    setAudioURL(newAudioURL);
    setAudioFile(event.data); // Guarda el archivo de audio en el estado
  };  

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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


  return (
    <div>
      {isLoggedIn ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card my-card">
                <div className="card-body">
                  <h5 className="card-title">Grabación de audio</h5>
                  <div className="form">
                  <div className="form-group mt-4">
                      <label htmlFor="user-select">Usuario:</label>
                      <UserSelect users={users} value={selectedUser} onSelect={(user) => setSelectedUser(user)} />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="atendido-select">Atendido:</label>
                      <UserSelect users={atendidos} value={selectedAtendido} onSelect={(atendido) => setSelectedAtendido(atendido)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <input id="checkbox" type="checkbox" />
                      <label className="switch" htmlFor="checkbox" onClick={handleRecord}>
                        <i className={`material-icons microphone ${recording ? 'active' : ''}`}>
                          {recording ? 'mic' : 'mic_none'}
                        </i>
                        <span className="label-text">{recording ? 'Stop' : 'Start'}</span>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    {!audioFile && !sending && !recording && (
                      <p className="card-text col-12">
                        Pulsa el boton de grabar para comenzar con el audio.
                      </p>
                    )}
                    {audioFile && !sending && !recording && (
                      <div className="col-12">
                        <audio src={audioURL || undefined} controls></audio>
                      </div>
                    )}
                    {recording && (
                      <p className="card-text col-12">
                        Tiempo de grabación: {formatTime(elapsedTime)}
                      </p>
                    )}
          
                  </div>

                  {sending && (
                      <div className='row'>
                        <div className="col-2">
                          {/* Muestra el preloader aquí */}
                          {isLoading && <Preloader />}
                        </div>
                        <div className='col-10'>
                          <p>{statusMessage}</p>
                        </div>
                      </div>
                    )}
                    
                  {audioFile && (
                    <div className="row d-flex justify-content-center">
                      <div className="col-12 text-center">
                        <div className='text-center' style={{ verticalAlign: 'middle' }}>
                        <button
                            className="custom-btn"
                            onClick={handleSendAudio}
                            disabled={!audioFile || !selectedUser || selectedUser === '' || !selectedAtendido || selectedAtendido === ''}>
                            {/* Resto del código del botón */}
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
                  )}
                  <div className='text-center'>
                    {((!selectedUser || !selectedAtendido) && audioFile) && (
                      <p className="warning-text">Por favor, seleccione un usuario y un atendido antes de enviar el mensaje.</p>
                    )}
                  </div>
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
