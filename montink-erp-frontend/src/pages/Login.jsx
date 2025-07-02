import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para admin
    if (isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpa erro quando usuário digita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simular validação (em produção seria uma API)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API

      if (formData.username === 'admin' && formData.password === 'admin123') {
        const userData = {
          username: 'admin',
          name: 'Admin',
          role: 'Administrador',
          loginTime: new Date().toISOString()
        };
        
        // Fazer login usando o contexto
        login(userData);
        
        // Redirecionar para o admin
        navigate('/admin', { replace: true });
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">M</div>
              <div className="logo-text">
                <h1>Montink ERP</h1>
                <p>Sistema de Gestão</p>
              </div>
            </div>
          </div>

          <div className="login-content">
            <h2>Bem-vindo de volta!</h2>
            <p className="login-subtitle">Faça login para acessar o painel administrativo</p>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Usuário</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Digite seu usuário"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    🔐 Entrar
                  </>
                )}
              </button>
            </form>

            <div className="login-demo">
              <div className="demo-info">
                <h4>👤 Credenciais de demonstração:</h4>
                <p><strong>Usuário:</strong> admin</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <div className="public-access">
              <p>Quer ver nossa loja?</p>
              <a href="/" className="loja-link">
                🛍️ Visitar Loja Online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
