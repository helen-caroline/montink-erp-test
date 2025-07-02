import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="app-container">
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
            to="/admin" 
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/pedidos" 
            className={location.pathname === '/admin/pedidos' ? 'active' : ''}
          >
            <span>📦</span>
            <span>Pedidos</span>
          </Link>
          
          <Link 
            to="/admin/produtos" 
            className={location.pathname === '/admin/produtos' ? 'active' : ''}
          >
            <span>📋</span>
            <span>Produtos</span>
          </Link>
          
          <Link 
            to="/admin/cupons" 
            className={location.pathname === '/admin/cupons' ? 'active' : ''}
          >
            <span>🎫</span>
            <span>Cupons</span>
          </Link>
          
          <Link 
            to="/institucional" 
            className="institucional-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>🏢</span>
            <span>Sobre Nós</span>
          </Link>
          
          <Link 
            to="/" 
            className="loja-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>🛍️</span>
            <span>Ver Loja</span>
          </Link>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">{user?.role || 'Administrador'}</span>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="Sair"
            >
              🚪
            </button>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AdminLayout;
