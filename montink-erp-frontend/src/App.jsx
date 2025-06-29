// helencaroline/Desktop/Projetos/montink-erp-test/montink-erp-frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './css/index.css';
import Pedidos from './pages/Pedidos.jsx';
import Estoque from './pages/Produtos.jsx';
import Cupons from './pages/Cupons.jsx';
import Institucional from './pages/Institucional.jsx';

function Home() {
  return (
    <div className="painel">
      <h1>Montink ERP</h1>
      <p className="subtitulo">Bem-vindo ao seu painel de gestão</p>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  
  return (
    <nav className="sidebar">
      <h2>Montink ERP</h2>
      <div className="menu">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/pedidos" className={location.pathname === '/pedidos' ? 'active' : ''}>Pedidos</Link>
        <Link to="/estoque" className={location.pathname === '/estoque' ? 'active' : ''}>Estoque</Link>
        <Link to="/cupons" className={location.pathname === '/cupons' ? 'active' : ''}>Cupons</Link>
        <Link to="/institucional" className={location.pathname === '/institucional' ? 'active' : ''}>Institucional</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/cupons" element={<Cupons />} />
            <Route path="/institucional" element={<Institucional />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}