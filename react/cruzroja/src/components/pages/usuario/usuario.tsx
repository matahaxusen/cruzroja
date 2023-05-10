import React, { useState, useEffect } from 'react';
import './../global.css';

interface UserInfo {
  password: string;
  email: string;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
}

interface AtendidoInfo {
  nombre: string;
  apellidos: string;
  email: string;
  lugar_nacimiento: string;
  casado: boolean;
  hijos: number;
  fecha_nacimiento: string;
  horario_contacto: string;
}

export const Usuario = () => {
  const [userInfoList, setUserInfoList] = useState<UserInfo[] | null>(null);
  const [atendidoInfoList, setAtendidoInfoList] = useState<AtendidoInfo[] | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/lista_usuarios/')
      .then((response) => response.json())
      .then((data) => setUserInfoList(data));

    fetch('http://localhost:8000/api/lista_atendidos/')
      .then((response) => response.json())
      .then((data) => setAtendidoInfoList(data));
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="my-card card">
            <div className="card-body">
              <h5 className="card-title">Información del usuario</h5>
              {userInfoList && (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha de nacimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfoList.map((userInfo, index) => (
                      <tr key={index}>
                        <td>{userInfo.nombre} {userInfo.apellidos}</td>
                        <td>{userInfo.email}</td>
                        <td>{userInfo.fecha_nacimiento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="my-card card">
            <div className="card-body">
              <h5 className="card-title">Información del atendido</h5>
              {atendidoInfoList && (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha de nacimiento</th>
                      <th>Lugar de nacimiento</th>
                      <th>Casado</th>
                      <th>Hijos</th>
                      <th>Horario de contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendidoInfoList.map((atendidoInfo, index) => (
                      <tr key={index}>
                        <td>{atendidoInfo.nombre} {atendidoInfo.apellidos}</td>
                        <td>{atendidoInfo.email}</td>
                        <td>{atendidoInfo.fecha_nacimiento}</td>
                        <td>{atendidoInfo.lugar_nacimiento}</td>
                        <td>{atendidoInfo.casado ? "Sí" : "No"}</td>
                        <td>{atendidoInfo.hijos}</td>
                        <td>{atendidoInfo.horario_contacto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
