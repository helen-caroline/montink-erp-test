// Cupons.jsx
import React, { useEffect, useState } from 'react';
import '../css/cupons.css';

const API = 'http://localhost:8000';

const Cupons = () => {
  const [cupons, setCupons] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [formCadastro, setFormCadastro] = useState({ codigo: '', desconto: '', validade: '', valor_minimo: '', vitalicio: false });
  const [formVinculo, setFormVinculo] = useState({ cupom_id: '', produto_id: '' });
  const [mensagemCadastro, setMensagemCadastro] = useState('');
  const [mensagemVinculo, setMensagemVinculo] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [aba, setAba] = useState('visualizar');

  useEffect(() => {
    carregarCupons();
    carregarProdutos();
  }, []);

  const carregarCupons = async () => {
    const resp = await fetch(API + '/cupons/view');
    const data = await resp.json();
    setCupons(data.cupons || []);
  };

  const carregarProdutos = async () => {
    const resp = await fetch(API + '/produtos/view');
    const data = await resp.json();
    setProdutos(data.produtos || []);
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formCadastro };
    if (formCadastro.vitalicio) payload.validade = null;
    const resp = await fetch(API + '/cupons/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      setMensagemCadastro('Cupom cadastrado com sucesso!');
      setFormCadastro({ codigo: '', desconto: '', validade: '', valor_minimo: '', vitalicio: false });
      carregarCupons();
    } else {
      setMensagemCadastro('Erro ao cadastrar cupom.');
    }
  };

  const handleVinculoSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch(API + '/cupons/vincular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formVinculo)
    });
    if (resp.ok) {
      setMensagemVinculo('Cupom vinculado ao produto!');
    } else {
      setMensagemVinculo('Erro ao vincular cupom.');
    }
  };

  const excluirSelecionados = async () => {
    if (!window.confirm(`Deseja excluir ${selecionados.length} cupom(ns)?`)) return;
    for (const id of selecionados) {
      await fetch(API + '/cupons/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    }
    setSelecionados([]);
    carregarCupons();
  };

  return (
    <div className="container">
      <h1>Cupons</h1>
      <div className="tabs">
        <button className={`tab-btn ${aba === 'visualizar' ? 'active' : ''}`} onClick={() => setAba('visualizar')}>Visualizar Cupons</button>
        <button className={`tab-btn ${aba === 'cadastrar' ? 'active' : ''}`} onClick={() => setAba('cadastrar')}>Cadastrar Cupom</button>
      </div>

      {aba === 'visualizar' && (
        <div id="tab-visualizar" className="tab-content active">
          <h3>Vincular Cupom a Produto</h3>
          <form className="form-vincular" onSubmit={handleVinculoSubmit}>
            <div className="vincular-row">
              <select required value={formVinculo.cupom_id} onChange={e => setFormVinculo(prev => ({ ...prev, cupom_id: e.target.value }))}>
                <option value="">Selecione um cupom</option>
                {cupons.map(c => (
                  <option key={c.id} value={c.id}>{c.codigo} (R$ {parseFloat(c.desconto).toFixed(2)})</option>
                ))}
              </select>
              <select required value={formVinculo.produto_id} onChange={e => setFormVinculo(prev => ({ ...prev, produto_id: e.target.value }))}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} (ID: {p.id})</option>
                ))}
              </select>
              <button type="submit" className="btn-salvar">Vincular</button>
            </div>
            <span>{mensagemVinculo}</span>
          </form>

          <h3>Cupons cadastrados</h3>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button className="btn-deletar" onClick={excluirSelecionados}>Excluir Selecionados</button>
          </div>
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={e => setSelecionados(e.target.checked ? cupons.map(c => c.id) : [])} checked={selecionados.length === cupons.length} /></th>
                <th>ID</th>
                <th>Código</th>
                <th>Desconto</th>
                <th>Validade</th>
                <th>Valor Mínimo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cupons.length === 0 ? (
                <tr><td colSpan="7">Nenhum cupom cadastrado.</td></tr>
              ) : cupons.map(cupom => (
                <tr key={cupom.id} className={selecionados.includes(cupom.id) ? 'selected' : ''}>
                  <td><input type="checkbox" checked={selecionados.includes(cupom.id)} onChange={() => setSelecionados(prev => prev.includes(cupom.id) ? prev.filter(i => i !== cupom.id) : [...prev, cupom.id])} /></td>
                  <td>{cupom.id}</td>
                  <td>{cupom.codigo}</td>
                  <td>R$ {parseFloat(cupom.desconto).toFixed(2)}</td>
                  <td>{cupom.validade ? cupom.validade : <span style={{ color: '#4fc3f7', fontWeight: 'bold' }}>Vitalício</span>}</td>
                  <td>R$ {parseFloat(cupom.valor_minimo).toFixed(2)}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aba === 'cadastrar' && (
        <div id="tab-cadastrar" className="tab-content">
          <h3>Cadastrar novo cupom</h3>
          <form onSubmit={handleCadastroSubmit}>
            <div className="campo">
              <label htmlFor="codigo">Código do cupom</label>
              <input type="text" id="codigo" required value={formCadastro.codigo} onChange={e => setFormCadastro(prev => ({ ...prev, codigo: e.target.value }))} />
            </div>
            <div className="campo">
              <label htmlFor="desconto">Desconto (R$)</label>
              <input type="number" id="desconto" step="0.01" min="0" required value={formCadastro.desconto} onChange={e => setFormCadastro(prev => ({ ...prev, desconto: e.target.value }))} />
            </div>
            <div className="campo">
              <label htmlFor="validade">Validade</label>
              <input type="date" id="validade" disabled={formCadastro.vitalicio} value={formCadastro.validade} onChange={e => setFormCadastro(prev => ({ ...prev, validade: e.target.value }))} />
              <label style={{ marginLeft: '15px' }}>
                <input type="checkbox" id="vitalicio" checked={formCadastro.vitalicio} onChange={e => setFormCadastro(prev => ({ ...prev, vitalicio: e.target.checked, validade: '' }))} /> Vitalício
              </label>
            </div>
            <div className="campo">
              <label htmlFor="valor_minimo">Valor mínimo (R$)</label>
              <input type="number" id="valor_minimo" step="0.01" min="0" required value={formCadastro.valor_minimo} onChange={e => setFormCadastro(prev => ({ ...prev, valor_minimo: e.target.value }))} />
            </div>
            <button type="submit" className="btn-salvar">Cadastrar Cupom</button>
            <span>{mensagemCadastro}</span>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cupons;