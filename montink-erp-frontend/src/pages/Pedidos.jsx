// Pedidos.jsx
import React, { useEffect, useState } from 'react';
import '../css/pedidos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API = 'http://localhost:8000';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [modalPedido, setModalPedido] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    fetch(API + '/pedidos/view')
      .then(res => res.json())
      .then(data => setPedidos(data.pedidos || []));
  }, []);

  const toggleSelecionado = (id) => {
    setSelecionados(prev => prev.includes(id)
      ? prev.filter(s => s !== id)
      : [...prev, id]);
  };

  const toggleTodos = (checked) => {
    setSelecionados(checked ? pedidos.map(p => p.id) : []);
  };

  const excluirSelecionados = async () => {
    if (!window.confirm(`Deseja realmente excluir ${selecionados.length} pedido(s)?`)) return;
    for (const id of selecionados) {
      await fetch(`${API}/pedidos/delete/${id}`, { method: 'DELETE' });
    }
    window.location.reload();
  };

  const salvarEdicao = async (e, pedido) => {
    e.preventDefault();
    const form = e.target;
    const status = form.status.value;
    const endereco = form.endereco.value;
    const cep = form.cep.value;

    await fetch(`${API}/pedidos/update/${pedido.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, endereco, cep, frete: pedido.frete, total: pedido.total })
    });

    for (const prod of pedido.produtos || []) {
      const qtd = form[`quantidade_${prod.produto_id}`]?.value;
      if (qtd && qtd != prod.quantidade) {
        await fetch(`${API}/pedidos/produto/update/${pedido.id}/${prod.produto_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade: qtd })
        });
      }
    }

    alert('Pedido atualizado com sucesso!');
    setModalPedido(null);
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="header-pedidos">
        <h1><i className="fa-solid fa-box-open"></i> Pedidos</h1>
        <button onClick={excluirSelecionados} className="btn-deletar">
          <i className="fa-solid fa-trash"></i> Excluir Selecionados
        </button>
      </div>
      <div className="tabela-wrapper">
        <table id="tabela-pedidos">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={e => toggleTodos(e.target.checked)} checked={selecionados.length === pedidos.length} /></th>
              <th>ID</th>
              <th><i className="fa-solid fa-user"></i> Cliente</th>
              <th><i className="fa-solid fa-clipboard-check"></i> Status</th>
              <th><i className="fa-solid fa-money-bill-wave"></i> Total</th>
              <th><i className="fa-solid fa-calendar-day"></i> Data</th>
              <th><i className="fa-solid fa-gear"></i> Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id} className={selecionados.includes(pedido.id) ? 'selected' : ''}>
                <td><input type="checkbox" checked={selecionados.includes(pedido.id)} onChange={() => toggleSelecionado(pedido.id)} /></td>
                <td>{pedido.id}</td>
                <td>{pedido.email}</td>
                <td>{pedido.status}</td>
                <td>R$ {Number(pedido.total).toFixed(2)}</td>
                <td>{new Date(pedido.criado_em).toLocaleString('pt-BR')}</td>
                <td>
                  <span
                    className="editar-pedido"
                    style={{ cursor: 'pointer', color: '#4fc3f7', fontSize: '1.3rem' }}
                    onClick={() => { setModalPedido(pedido); setModoEdicao(true); }}
                    title="Editar produtos"
                  >&#9998;</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalPedido && (
        <div className="modal-bg" id="modal-bg" onClick={e => e.target.id === 'modal-bg' && setModalPedido(null)}>
          <div className="modal" id="modal-pedido">
            <span className="modal-close" id="fechar-modal" onClick={() => setModalPedido(null)}>&times;</span>
            <h2><i className="fa-solid fa-receipt"></i> Detalhes do Pedido</h2>
            <form onSubmit={(e) => salvarEdicao(e, modalPedido)}>
              <p><strong>ID:</strong> {modalPedido.id}</p>
              <p><strong>Status:</strong> {modoEdicao ? (
                <select name="status" defaultValue={modalPedido.status} style={{ width: '120px' }}>
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              ) : modalPedido.status}</p>
              <p><strong>Cliente:</strong> {modalPedido.email}</p>
              <p><strong>Endereço:</strong> {modoEdicao ? <input type="text" name="endereco" defaultValue={modalPedido.endereco} style={{ width: '220px' }} /> : modalPedido.endereco}</p>
              <p><strong>CEP:</strong> {modoEdicao ? <input type="text" name="cep" defaultValue={modalPedido.cep} style={{ width: '220px' }} /> : modalPedido.cep}</p>
              <p><strong>Frete:</strong> R$ {modalPedido.frete}</p>
              <p><strong>Total:</strong> R$ {modalPedido.total}</p>
              <p><strong>Data:</strong> {new Date(modalPedido.criado_em).toLocaleString('pt-BR')}</p>
              <div className="produtos-lista">
                <h3>Produtos do Pedido</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Cor</th>
                      <th>Modelo</th>
                      <th>Marca</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(modalPedido.produtos || []).map(prod => (
                      <tr key={prod.produto_id}>
                        <td>{prod.nome || '-'}</td>
                        <td>
                          {modoEdicao
                            ? <input type="number" min="1" name={`quantidade_${prod.produto_id}`} defaultValue={prod.quantidade} style={{ width: '60px' }} />
                            : prod.quantidade}
                        </td>
                        <td>R$ {Number(prod.preco).toFixed(2)}</td>
                        <td>{prod.cor || '-'}</td>
                        <td>{prod.modelo || '-'}</td>
                        <td>{prod.marca || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {modoEdicao && (
                <button type="submit" style={{ marginTop: '16px', background: '#4fc3f7', color: '#232e43', padding: '8px 18px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                  Salvar
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;