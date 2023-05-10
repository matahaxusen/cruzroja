import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import './privateroute.css'

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const formData = qs.stringify({
        username,
        password,
      });
  
      const response = await axios.post('http://localhost:8000/api/login/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      localStorage.setItem('token', response.data.token);
      setMessage('Inicio de sesión exitoso');
      onLoginSuccess();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Error al iniciar sesión');
    }
  };

  return (
    <div className={"login-container"}>
      <div className={"login-form"}>
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Usuario:
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Iniciar sesión</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
