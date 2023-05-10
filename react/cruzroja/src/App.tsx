import { useState } from "react";
import './App.css';
import { Sidebar } from './components/sidebar/sidebar';
import { Directo } from './components/pages/smartvoice/directo/directo';
import { Transcripciones } from "./components/pages/smartvoice/transcripciones/transcripciones";
import { Usuario } from "./components/pages/usuario/usuario";
import { Configuracion } from "./components/pages/configuracion/configuracion";
import { Unitarias } from './components/pages/estadisticas/unitarias/unitarias';
import { Multiusuario } from './components/pages/estadisticas/multiusuario/multiusuario';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";


const App = () => {
  const [currentPage, setCurrentPage] = useState<string>("Home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleSidebarClick = (item: string) => {
    setCurrentPage(item);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div>
        <Sidebar handleClick={handleSidebarClick} />
        <div className={`page-container ${!sidebarOpen ? "sidebar-closed" : ""}`}>
          <Routes>
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/smartvoice/directo" element={<Directo />} />
            <Route path="/smartvoice/transcripciones" element={<Transcripciones />} />
            <Route path="/estadisticas/graficos" element={<Unitarias />} />
            <Route path="/estadisticas/preguntas" element={<Multiusuario />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
