import React, { useEffect, useState } from 'react';
import '../css/cupons.css';

const API = 'http://localhost:8000';

const Cupons = () => {
  const [cupons, setCupons] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [activeTab, setActiveTab] = useState('lista');
  const [formCadastro, setFormCadastro] = useState({ 
    codigo: '', 
    desconto: '', 
    validade: '', 
    valor_minimo: '', 
    vitalicio: false 
  });
  const [formVinculo, setFormVinculo] = useState({ cupom_id: '', produto_id: '' });
  const [mensagemCadastro, setMensagemCadastro] = useState({ text: '', color: '' });
  const [mensagemVinculo, setMensagemVinculo] = useState({ text: '', color: '' });
  const [selecionados, setSelecionados] = useState([]);
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  useEffect(() => {
    carregarCupons();
    carregarProdutos();
  }, []);

  const carregarCupons = async () => {
    try {
      const resp = await fetch(API + '/cupons/view');
      const data = await resp.json();
      setCupons(data.cupons || []);
      setSelecionados([]);
      setSelecionarTodos(false);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const resp = await fetch(API + '/produtos/view');
      const data = await resp.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMensagemCadastro({ text: '', color: '' });
    setMensagemVinculo({ text: '', color: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormCadastro(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'vitalicio' && checked ? { validade: '' } : {})
    }));
  };

  const gerarCodigoAleatorio = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setFormCadastro(prev => ({ ...prev, codigo }));
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formCadastro };
      if (formCadastro.vitalicio) payload.validade = null;

      const resp = await fetch(API + '/cupons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        setMensagemCadastro({ text: 'Cupom cadastrado com sucesso!', color: 'success' });
        setFormCadastro({ codigo: '', desconto: '', validade: '', valor_minimo: '', vitalicio: false });
        carregarCupons();
        
        setTimeout(() => {
          setMensagemCadastro({ text: '', color: '' });
        }, 3000);
      } else {
        setMensagemCadastro({ text: 'Erro ao cadastrar cupom.', color: 'error' });
      }
    } catch (error) {
      console.error('Erro ao cadastrar cupom:', error);
      setMensagemCadastro({ text: 'Erro ao cadastrar cupom.', color: 'error' });
    }
  };

  const handleVinculoSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(API + '/cupons/vincular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formVinculo)
      });

      if (resp.ok) {
        setMensagemVinculo({ text: 'Cupom vinculado ao produto com sucesso!', color: 'success' });
        setFormVinculo({ cupom_id: '', produto_id: '' });
        
        setTimeout(() => {
          setMensagemVinculo({ text: '', color: '' });
        }, 3000);
      } else {
        setMensagemVinculo({ text: 'Erro ao vincular cupom.', color: 'error' });
      }
    } catch (error) {
      console.error('Erro ao vincular cupom:', error);
      setMensagemVinculo({ text: 'Erro ao vincular cupom.', color: 'error' });
    }
  };

  const handleSelecionarTodos = (e) => {
    const isChecked = e.target.checked;
    setSelecionarTodos(isChecked);
    setSelecionados(isChecked ? cupons.map(c => c.id) : []);
  };

  const handleSelecionarCupom = (cupomId) => {
    const novosSelecionados = selecionados.includes(cupomId)
      ? selecionados.filter(id => id !== cupomId)
      : [...selecionados, cupomId];
    
    setSelecionados(novosSelecionados);
    setSelecionarTodos(novosSelecionados.length === cupons.length && cupons.length > 0);
  };

  const excluirSelecionados = async () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um cupom para excluir.');
      return;
    }

    if (!window.confirm(`Deseja excluir ${selecionados.length} cupom(ns)?`)) return;

    try {
      for (const id of selecionados) {
        await fetch(API + '/cupons/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      }
      carregarCupons();
    } catch (error) {
      console.error('Erro ao excluir cupons:', error);
    }
  };

  const toggleStatusCupom = async (cupomId) => {
    try {
      const response = await fetch(API + '/cupons/toggle-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cupomId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualizar o cupom localmente
        setCupons(prev => prev.map(cupom => 
          cupom.id === cupomId 
            ? { ...cupom, ativo: data.ativo ? 1 : 0 }
            : cupom
        ));
        
        // Mostrar mensagem de sucesso
        const status = data.ativo ? 'ativado' : 'desativado';
        setMensagemCadastro({ 
          text: `✅ Cupom ${status} com sucesso!`, 
          color: 'success' 
        });
        
        // Remover mensagem após 3 segundos
        setTimeout(() => {
          setMensagemCadastro({ text: '', color: '' });
        }, 3000);
      } else {
        setMensagemCadastro({ 
          text: '❌ Erro ao alterar status do cupom', 
          color: 'error' 
        });
      }
    } catch (error) {
      console.error('Erro ao alterar status do cupom:', error);
      setMensagemCadastro({ 
        text: '❌ Erro de conexão ao alterar status', 
        color: 'error' 
      });
    }
  };

  return (
    <div className="cupons-container">
      <div className="cupons-header">
        <h1>Gerenciamento de Cupons</h1>
        <p className="cupons-subtitle">
          Crie, gerencie e vincule cupons de desconto aos seus produtos
        </p>
      </div>

      <div className="cupons-tabs">
        <button 
          className={`cupons-tab-btn ${activeTab === 'lista' ? 'active' : ''}`} 
          onClick={() => handleTabChange('lista')}
        >
          Lista de Cupons
        </button>
        <button 
          className={`cupons-tab-btn ${activeTab === 'cadastro' ? 'active' : ''}`} 
          onClick={() => handleTabChange('cadastro')}
        >
          Cadastrar Cupom
        </button>
        <button 
          className={`cupons-tab-btn ${activeTab === 'vincular' ? 'active' : ''}`} 
          onClick={() => handleTabChange('vincular')}
        >
          Vincular Cupons
        </button>
      </div>

      {activeTab === 'lista' && (
        <div className="cupons-tab-content active">
          <div className="cupons-actions">
            <h3>Lista de Cupons ({cupons.length})</h3>
            <div className="cupons-actions-buttons">
              <button 
                className="btn btn-primary"
                onClick={carregarCupons}
              >
                Atualizar
              </button>
              <button 
                className="btn btn-danger"
                onClick={excluirSelecionados}
                disabled={selecionados.length === 0}
              >
                Excluir Selecionados ({selecionados.length})
              </button>
            </div>
          </div>

          <div className="cupons-table-container">
            <table className="cupons-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <input 
                      type="checkbox" 
                      className="cupons-checkbox"
                      checked={selecionarTodos}
                      onChange={handleSelecionarTodos}
                    />
                  </th>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Desconto</th>
                  <th>Validade</th>
                  <th>Valor Mínimo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cupons.length > 0 ? (
                  cupons.map(cupom => {
                    const isExpirado = cupom.validade && new Date(cupom.validade) < new Date();
                    const isAtivo = cupom.ativo === 1 || cupom.ativo === true;
                    
                    return (
                      <tr key={cupom.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            className="cupons-checkbox"
                            checked={selecionados.includes(cupom.id)}
                            onChange={() => handleSelecionarCupom(cupom.id)}
                          />
                        </td>
                        <td>#{cupom.id}</td>
                        <td>
                          <span className="cupom-codigo-table">{cupom.codigo}</span>
                        </td>
                        <td>
                          <span className="cupom-desconto-table">
                            R$ {parseFloat(cupom.desconto).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          {cupom.validade ? (
                            <span className="cupom-validade">
                              {new Date(cupom.validade).toLocaleDateString('pt-BR')}
                            </span>
                          ) : (
                            <span className="cupom-vitalicio">Vitalício</span>
                          )}
                        </td>
                        <td>R$ {parseFloat(cupom.valor_minimo).toFixed(2)}</td>
                        <td>
                          <span className={`cupom-status ${
                            isExpirado ? 'expirado' : 
                            isAtivo ? 'ativo' : 'inativo'
                          }`}>
                            {isExpirado ? 'Expirado' : 
                             isAtivo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn-toggle-status ${isAtivo ? 'ativo' : 'inativo'}`}
                            onClick={() => toggleStatusCupom(cupom.id)}
                            disabled={isExpirado}
                            title={
                              isExpirado ? 'Não é possível alterar cupom expirado' :
                              isAtivo ? 'Desativar cupom' : 'Ativar cupom'
                            }
                          >
                            {isAtivo ? '🔴' : '🟢'} {isAtivo ? 'Desativar' : 'Ativar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="cupons-empty">
                        <h3>Nenhum cupom encontrado</h3>
                        <p>Comece cadastrando seu primeiro cupom na aba "Cadastrar Cupom"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cadastro' && (
        <div className="cupons-tab-content active">
          <div className="cupons-form-container">
            <h3>Cadastrar Novo Cupom</h3>
            
            {mensagemCadastro.text && (
              <div className={`cupons-message cupons-message-${mensagemCadastro.color}`}>
                {mensagemCadastro.text}
              </div>
            )}

            <form onSubmit={handleCadastroSubmit}>
              <div className="cupons-form">
                <div className="cupons-field">
                  <label htmlFor="codigo" className="cupons-label required">Código do Cupom</label>
                  <div className="input-with-button">
                    <input 
                      type="text" 
                      id="codigo" 
                      name="codigo"
                      className="cupons-input"
                      value={formCadastro.codigo}
                      onChange={handleInputChange}
                      placeholder="Digite o código do cupom"
                      required 
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={gerarCodigoAleatorio}
                    >
                      Gerar
                    </button>
                  </div>
                </div>

                <div className="cupons-field">
                  <label htmlFor="desconto" className="cupons-label required">Desconto (R$)</label>
                  <input 
                    type="number" 
                    id="desconto" 
                    name="desconto"
                    className="cupons-input"
                    value={formCadastro.desconto}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>

                <div className="cupons-field">
                  <label htmlFor="valor_minimo" className="cupons-label required">Valor Mínimo (R$)</label>
                  <input 
                    type="number" 
                    id="valor_minimo" 
                    name="valor_minimo"
                    className="cupons-input"
                    value={formCadastro.valor_minimo}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>

                <div className="cupons-field cupons-field-full">
                  <label htmlFor="validade" className="cupons-label">Validade</label>
                  <input 
                    type="date" 
                    id="validade" 
                    name="validade"
                    className="cupons-input"
                    disabled={formCadastro.vitalicio}
                    value={formCadastro.validade}
                    onChange={handleInputChange}
                  />
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="vitalicio" 
                      name="vitalicio"
                      className="cupons-checkbox"
                      checked={formCadastro.vitalicio}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="vitalicio">Cupom vitalício (sem data de expiração)</label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setFormCadastro({ codigo: '', desconto: '', validade: '', valor_minimo: '', vitalicio: false });
                    setMensagemCadastro({ text: '', color: '' });
                  }}
                >
                  Limpar Formulário
                </button>
                <button type="submit" className="btn btn-primary">
                  Cadastrar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'vincular' && (
        <div className="cupons-tab-content active">
          <div className="cupons-form-container">
            <h3>Vincular Cupom a Produto</h3>
            <p className="form-description">
              Vincule cupons específicos a produtos para criar promoções direcionadas
            </p>

            {mensagemVinculo.text && (
              <div className={`cupons-message cupons-message-${mensagemVinculo.color}`}>
                {mensagemVinculo.text}
              </div>
            )}

            <form onSubmit={handleVinculoSubmit}>
              <div className="cupons-form">
                <div className="cupons-field">
                  <label htmlFor="cupom_id" className="cupons-label required">Selecionar Cupom</label>
                  <select 
                    id="cupom_id"
                    name="cupom_id"
                    className="cupons-input"
                    value={formVinculo.cupom_id}
                    onChange={e => setFormVinculo(prev => ({ ...prev, cupom_id: e.target.value }))}
                    required
                  >
                    <option value="">Escolha um cupom</option>
                    {cupons.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.codigo} - R$ {parseFloat(c.desconto).toFixed(2)} de desconto
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cupons-field">
                  <label htmlFor="produto_id" className="cupons-label required">Selecionar Produto</label>
                  <select 
                    id="produto_id"
                    name="produto_id"
                    className="cupons-input"
                    value={formVinculo.produto_id}
                    onChange={e => setFormVinculo(prev => ({ ...prev, produto_id: e.target.value }))}
                    required
                  >
                    <option value="">Escolha um produto</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setFormVinculo({ cupom_id: '', produto_id: '' });
                    setMensagemVinculo({ text: '', color: '' });
                  }}
                >
                  Limpar Seleção
                </button>
                <button type="submit" className="btn btn-primary">
                  Vincular Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cupons;