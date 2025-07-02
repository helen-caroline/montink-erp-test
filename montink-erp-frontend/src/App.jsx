import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Loja from './pages/Loja';
import InstitucionalPublico from './pages/InstitucionalPublico';
import Pedidos from './pages/Pedidos.jsx';
import Produtos from './pages/Produtos.jsx';
import Cupons from './pages/Cupons.jsx';
import './css/index.css';
import './App.css';

function Home() {
  return (
    <div className="painel">
      <div className="dashboard-header">
        <h1>💼 Montink ERP</h1>
        <p className="subtitulo">
          Bem-vindo ao seu sistema de gestão empresarial inteligente e moderno
        </p>
      </div>
      
      <div className="atalhos">
        <a href="/admin/pedidos" className="card">
          <div className="icon">📦</div>
          <span>Gerenciar Pedidos</span>
          <p className="card-description">Visualize, edite e acompanhe todos os pedidos em tempo real</p>
        </a>
        
        <a href="/admin/produtos" className="card">
          <div className="icon">📋</div>
          <span>Controle de Estoque</span>
          <p className="card-description">Gerencie seu inventário com controle total de produtos</p>
        </a>
        
        <a href="/admin/cupons" className="card">
          <div className="icon">🎫</div>
          <span>Cupons de Desconto</span>
          <p className="card-description">Crie e gerencie promoções para impulsionar vendas</p>
        </a>
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota principal - Loja pública */}
          <Route path="/" element={<Loja />} />
          
          {/* Rota pública institucional */}
          <Route path="/institucional" element={<InstitucionalPublico />} />
          
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas do admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/cupons" element={<Cupons />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Alias para a loja (opcional) */}
          <Route path="/loja" element={<Navigate to="/" replace />} />
          
          {/* Redirecionamento de rotas antigas */}
          <Route path="/pedidos" element={<Navigate to="/admin/pedidos" replace />} />
          <Route path="/produtos" element={<Navigate to="/admin/produtos" replace />} />
          <Route path="/cupons" element={<Navigate to="/admin/cupons" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}