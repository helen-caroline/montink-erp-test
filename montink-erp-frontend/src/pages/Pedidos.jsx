import React, { useEffect, useState } from 'react';
import '../css/pedidos.css';

const API = 'http://localhost:8000';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [modalPedido, setModalPedido] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const response = await fetch(`${API}/pedidos/view`);
      const data = await response.json();
      setPedidos(data.pedidos || []);
      setSelecionados([]);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const toggleSelecionado = (id) => {
    setSelecionados(prev => prev.includes(id)
      ? prev.filter(s => s !== id)
      : [...prev, id]);
  };

  const toggleTodos = (checked) => {
    const pedidosFiltrados = pedidosFiltradosLista();
    setSelecionados(checked ? pedidosFiltrados.map(p => p.id) : []);
  };

  const excluirSelecionados = async () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um pedido para excluir.');
      return;
    }

    if (!window.confirm(`Deseja realmente excluir ${selecionados.length} pedido(s)?`)) return;
    
    try {
      for (const id of selecionados) {
        await fetch(`${API}/pedidos/delete/${id}`, { method: 'DELETE' });
      }
      carregarPedidos();
    } catch (error) {
      console.error('Erro ao excluir pedidos:', error);
    }
  };

  const salvarEdicao = async (e, pedido) => {
    e.preventDefault();
    const form = e.target;
    const status = form.status.value;
    const endereco = form.endereco.value;
    const cep = form.cep.value;

    try {
      await fetch(`${API}/pedidos/update/${pedido.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, endereco, cep, frete: pedido.frete, total: pedido.total })
      });

      for (const prod of pedido.produtos || []) {
        const qtd = form[`quantidade_${prod.produto_id}`]?.value;
        if (qtd && qtd != prod.quantidade) {
          await fetch(`${API}/pedidos/update-produto`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pedido_id: pedido.id,
              produto_id: prod.produto_id,
              quantidade: parseInt(qtd)
            })
          });
        }
      }

      alert('Pedido atualizado com sucesso!');
      setModalPedido(null);
      setModoEdicao(false);
      carregarPedidos();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      alert('Erro ao atualizar pedido.');
    }
  };

  const pedidosFiltradosLista = () => {
    return pedidos.filter(pedido => {
      const matchStatus = filtroStatus === 'todos' || pedido.status.toLowerCase() === filtroStatus.toLowerCase();
      const matchData = !filtroData || pedido.criado_em.includes(filtroData);
      const matchBusca = !busca || 
        pedido.email.toLowerCase().includes(busca.toLowerCase()) ||
        pedido.id.toString().includes(busca) ||
        pedido.status.toLowerCase().includes(busca.toLowerCase());
      
      return matchStatus && matchData && matchBusca;
    });
  };

  const calcularEstatisticas = () => {
    const total = pedidos.length;
    const pendentes = pedidos.filter(p => p.status === 'Pendente').length;
    const pagos = pedidos.filter(p => p.status === 'Pago').length;
    const enviados = pedidos.filter(p => p.status === 'Enviado').length;
    const cancelados = pedidos.filter(p => p.status === 'Cancelado').length;
    const valorTotal = pedidos.reduce((acc, p) => acc + parseFloat(p.total || 0), 0);

    return { total, pendentes, pagos, enviados, cancelados, valorTotal };
  };

  const estatisticas = calcularEstatisticas();
  const pedidosFiltrados = pedidosFiltradosLista();

  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <h1>Gerenciamento de Pedidos</h1>
        <p className="pedidos-subtitle">
          Visualize e gerencie todos os pedidos do seu e-commerce
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="pedidos-stats">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <h3>{estatisticas.total}</h3>
            <p>Total de Pedidos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pendente">⏳</div>
          <div className="stat-info">
            <h3>{estatisticas.pendentes}</h3>
            <p>Pendentes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pago">✅</div>
          <div className="stat-info">
            <h3>{estatisticas.pagos}</h3>
            <p>Pagos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon enviado">🚚</div>
          <div className="stat-info">
            <h3>{estatisticas.enviados}</h3>
            <p>Enviados</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cancelado">❌</div>
          <div className="stat-info">
            <h3>{estatisticas.cancelados}</h3>
            <p>Cancelados</p>
          </div>
        </div>
        <div className="stat-card valor">
          <div className="stat-icon valor">💰</div>
          <div className="stat-info">
            <h3>R$ {estatisticas.valorTotal.toFixed(2)}</h3>
            <p>Valor Total</p>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="pedidos-actions">
        <div className="pedidos-filters">
          <div className="filter-group">
            <label htmlFor="busca" className="filter-label">Buscar</label>
            <input
              type="text"
              id="busca"
              className="pedidos-input"
              placeholder="Buscar por ID, email ou status..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="filtroStatus" className="filter-label">Status</label>
            <select
              id="filtroStatus"
              className="pedidos-input"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="enviado">Enviado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filtroData" className="filter-label">Data</label>
            <input
              type="date"
              id="filtroData"
              className="pedidos-input"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>
        </div>

        <div className="pedidos-actions-buttons">
          <button 
            className="btn btn-primary"
            onClick={carregarPedidos}
          >
            Atualizar
          </button>
          <button 
            className="btn btn-danger"
            onClick={excluirSelecionados}
            disabled={selecionados.length === 0}
          >
            🗑️ Excluir Selecionados ({selecionados.length})
          </button>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="pedidos-table-container">
        <div className="table-header">
          <h3>Lista de Pedidos ({pedidosFiltrados.length})</h3>
          {busca || filtroStatus !== 'todos' || filtroData ? (
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => {
                setBusca('');
                setFiltroStatus('todos');
                setFiltroData('');
              }}
            >
              Limpar Filtros
            </button>
          ) : null}
        </div>

        <table className="pedidos-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input 
                  type="checkbox" 
                  className="pedidos-checkbox"
                  onChange={e => toggleTodos(e.target.checked)} 
                  checked={selecionados.length === pedidosFiltrados.length && pedidosFiltrados.length > 0} 
                />
              </th>
              <th>ID</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map(pedido => (
                <tr key={pedido.id} className={selecionados.includes(pedido.id) ? 'selected' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="pedidos-checkbox"
                      checked={selecionados.includes(pedido.id)} 
                      onChange={() => toggleSelecionado(pedido.id)} 
                    />
                  </td>
                  <td>
                    <span className="pedido-id">#{pedido.id}</span>
                  </td>
                  <td>
                    <div className="cliente-info">
                      <span className="cliente-email">{pedido.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`pedido-status status-${pedido.status.toLowerCase()}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td>
                    <span className="pedido-valor">R$ {Number(pedido.total).toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="pedido-data">
                      {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-acao btn-editar"
                      onClick={() => { setModalPedido(pedido); setModoEdicao(true); }}
                      title="Editar pedido"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-acao btn-visualizar"
                      onClick={() => { setModalPedido(pedido); setModoEdicao(false); }}
                      title="Visualizar detalhes"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="pedidos-empty">
                    <h3>Nenhum pedido encontrado</h3>
                    <p>
                      {busca || filtroStatus !== 'todos' || filtroData 
                        ? 'Tente ajustar os filtros de busca' 
                        : 'Quando houver pedidos, eles aparecerão aqui'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes do Pedido */}
      {modalPedido && (
        <div className="modal-bg" onClick={e => e.target.classList.contains('modal-bg') && setModalPedido(null)}>
          <div className="modal pedido-modal">
            <div className="modal-header">
              <h2>
                {modoEdicao ? '✏️ Editar Pedido' : '👁️ Detalhes do Pedido'}
              </h2>
              <button 
                className="modal-close" 
                onClick={() => {
                  setModalPedido(null);
                  setModoEdicao(false);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <form onSubmit={(e) => modoEdicao ? salvarEdicao(e, modalPedido) : e.preventDefault()}>
                <div className="pedido-info-grid">
                  <div className="info-group">
                    <label>ID do Pedido</label>
                    <span className="info-value">#{modalPedido.id}</span>
                  </div>

                  <div className="info-group">
                    <label>Status</label>
                    {modoEdicao ? (
                      <select name="status" defaultValue={modalPedido.status} className="pedidos-input">
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    ) : (
                      <span className={`pedido-status status-${modalPedido.status.toLowerCase()}`}>
                        {modalPedido.status}
                      </span>
                    )}
                  </div>

                  <div className="info-group">
                    <label>Cliente</label>
                    <span className="info-value">{modalPedido.email}</span>
                  </div>

                  <div className="info-group">
                    <label>Data do Pedido</label>
                    <span className="info-value">
                      {new Date(modalPedido.criado_em).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="info-group full-width">
                    <label>Endereço de Entrega</label>
                    {modoEdicao ? (
                      <input 
                        type="text" 
                        name="endereco" 
                        defaultValue={modalPedido.endereco} 
                        className="pedidos-input"
                      />
                    ) : (
                      <span className="info-value">{modalPedido.endereco}</span>
                    )}
                  </div>

                  <div className="info-group">
                    <label>CEP</label>
                    {modoEdicao ? (
                      <input 
                        type="text" 
                        name="cep" 
                        defaultValue={modalPedido.cep} 
                        className="pedidos-input"
                      />
                    ) : (
                      <span className="info-value">{modalPedido.cep}</span>
                    )}
                  </div>

                  <div className="info-group">
                    <label>Frete</label>
                    <span className="info-value">R$ {parseFloat(modalPedido.frete || 0).toFixed(2)}</span>
                  </div>

                  <div className="info-group">
                    <label>Total</label>
                    <span className="info-value valor-destaque">
                      R$ {parseFloat(modalPedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Produtos do Pedido */}
                <div className="produtos-pedido">
                  <h3>Produtos do Pedido</h3>
                  <div className="produtos-table-container">
                    <table className="produtos-table">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Quantidade</th>
                          <th>Preço Unit.</th>
                          <th>Cor</th>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(modalPedido.produtos || []).map(prod => (
                          <tr key={prod.produto_id}>
                            <td>{prod.nome || '-'}</td>
                            <td>
                              {modoEdicao ? (
                                <input 
                                  type="number" 
                                  min="1" 
                                  name={`quantidade_${prod.produto_id}`} 
                                  defaultValue={prod.quantidade} 
                                  className="pedidos-input input-sm"
                                />
                              ) : (
                                <span className="quantidade">{prod.quantidade}</span>
                              )}
                            </td>
                            <td>R$ {Number(prod.preco).toFixed(2)}</td>
                            <td>{prod.cor || '-'}</td>
                            <td>{prod.modelo || '-'}</td>
                            <td>{prod.marca || '-'}</td>
                            <td>
                              <strong>R$ {(prod.quantidade * parseFloat(prod.preco)).toFixed(2)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {modoEdicao && (
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setModoEdicao(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      💾 Salvar Alterações
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;