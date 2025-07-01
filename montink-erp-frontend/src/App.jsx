import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './css/index.css';
import './App.css';
import Pedidos from './pages/Pedidos.jsx';
import Produtos from './pages/Produtos.jsx';
import Cupons from './pages/Cupons.jsx';
import Institucional from './pages/Institucional.jsx';

function Home() {
  return (
    <div className="painel">
      <div className="dashboard-header">
        <h1>💼 Montink ERP</h1>
        <p className="subtitulo">
          Bem-vindo ao seu sistema de gestão empresarial inteligente e moderno
        </p>
      </div>
      
      {/* <div className="dashboard-stats">
        <div className="stat-overview">
          <div className="stat-item">
            <div className="stat-icon primary">📊</div>
            <div className="stat-content">
              <h3>Sistema Integrado</h3>
              <p>Gestão completa em uma plataforma</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon success">⚡</div>
            <div className="stat-content">
              <h3>Automatização</h3>
              <p>Processos otimizados e eficientes</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon warning">📈</div>
            <div className="stat-content">
              <h3>Crescimento</h3>
              <p>Impulsione seu negócio</p>
            </div>
          </div>
        </div>
      </div> */}
      
      <div className="atalhos">
        <Link to="/pedidos" className="card">
          <div className="icon">📦</div>
          <span>Gerenciar Pedidos</span>
          <p className="card-description">Visualize, edite e acompanhe todos os pedidos em tempo real</p>
        </Link>
        
        <Link to="/produtos" className="card">
          <div className="icon">📋</div>
          <span>Controle de Estoque</span>
          <p className="card-description">Gerencie seu inventário com controle total de produtos</p>
        </Link>
        
        <Link to="/cupons" className="card">
          <div className="icon">🎫</div>
          <span>Cupons de Desconto</span>
          <p className="card-description">Crie e gerencie promoções para impulsionar vendas</p>
        </Link>
        
        <Link to="/institucional" className="card">
          <div className="icon">🏢</div>
          <span>Informações da Empresa</span>
          <p className="card-description">Dados institucionais e configurações do sistema</p>
        </Link>
      </div>

      <div className="dashboard-features">
        <div className="features-header">
          <h2>Recursos Principais</h2>
          <p>Explore todas as funcionalidades do seu ERP</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🔄</div>
            <h4>Sincronização</h4>
            <p>Dados sempre atualizados em tempo real</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <h4>Responsivo</h4>
            <p>Acesse de qualquer dispositivo</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h4>Segurança</h4>
            <p>Seus dados protegidos com criptografia</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h4>Relatórios</h4>
            <p>Insights detalhados para decisões</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">M</div>
        <div className="sidebar-info">
          <h2>Montink ERP</h2>
          <div className="sidebar-subtitle">Sistema de Gestão</div>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          <span>🏠</span>
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/pedidos" 
          className={location.pathname === '/pedidos' ? 'active' : ''}
        >
          <span>📦</span>
          <span>Pedidos</span>
        </Link>
        
        <Link 
          to="/produtos" 
          className={location.pathname === '/produtos' ? 'active' : ''}
        >
          <span>📋</span>
          <span>Produtos</span>
        </Link>
        
        <Link 
          to="/cupons" 
          className={location.pathname === '/cupons' ? 'active' : ''}
        >
          <span>🎫</span>
          <span>Cupons</span>
        </Link>
        
        <Link 
          to="/institucional" 
          className={location.pathname === '/institucional' ? 'active' : ''}
        >
          <span>🏢</span>
          <span>Institucional</span>
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/cupons" element={<Cupons />} />
            <Route path="/institucional" element={<Institucional />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}