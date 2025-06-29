// Cupons.jsx
import React, { useEffect } from 'react';
import '../css/cupons.css';

const Cupons = () => {
  useEffect(() => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', function () {
        tabs.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

        this.classList.add('active');
        const tabId = this.dataset.tab;
        document.getElementById(`tab-${tabId}`).classList.add('active');

        if (tabId === 'visualizar') {
          if (window.carregarSelectProdutos) window.carregarSelectProdutos();
          if (window.carregarSelectCupons) window.carregarSelectCupons();
        }
      });
    });

    // Cleanup listeners on unmount
    return () => {
      tabs.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
      });
    };
  }, []);

  return (
    <div className="container">
      <h1>Cupons</h1>
      <div className="tabs">
        <button className="tab-btn active" data-tab="visualizar">Visualizar Cupons</button>
        <button className="tab-btn" data-tab="cadastrar">Cadastrar Cupom</button>
      </div>

      <div id="tab-visualizar" className="tab-content active">
        <h3>Vincular Cupom a Produto</h3>
        <form id="form-vincular-cupom-produto" className="form-vincular">
          <div className="vincular-row">
            <select id="select-cupom" required>
              <option value="">Selecione um cupom</option>
            </select>
            <select id="select-produto" required>
              <option value="">Selecione um produto</option>
            </select>
            <button type="submit" className="btn-salvar">Vincular</button>
          </div>
          <span id="mensagem-vinculo"></span>
        </form>

        <h3>Cupons cadastrados</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button id="btn-excluir-selecionados-cupons" className="btn-deletar" style={{ marginBottom: 0 }}>
            Excluir Selecionados
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" id="selecionar-todos-cupons" title="Selecionar todos" /></th>
              <th>ID</th>
              <th>Código</th>
              <th>Desconto</th>
              <th>Validade</th>
              <th>Valor Mínimo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="cupons-tbody">
            {/* Linhas de cupons serão inseridas aqui dinamicamente */}
          </tbody>
        </table>
      </div>

      <div id="tab-cadastrar" className="tab-content">
        <h3>Cadastrar novo cupom</h3>
        <form id="form-cadastrar-cupom">
          <div className="campo">
            <label htmlFor="codigo">Código do cupom</label>
            <input type="text" id="codigo" required />
          </div>
          <div className="campo">
            <label htmlFor="desconto">Desconto (R$)</label>
            <input type="number" id="desconto" name="desconto" step="0.01" min="0" required />
          </div>
          <div className="campo">
            <label htmlFor="validade">Validade</label>
            <input type="date" id="validade" />
            <label style={{ marginLeft: '15px' }}>
              <input type="checkbox" id="vitalicio" /> Vitalício
            </label>
          </div>
          <div className="campo">
            <label htmlFor="valor_minimo">Valor mínimo (R$)</label>
            <input type="number" id="valor_minimo" name="valor_minimo" step="0.01" min="0" required />
          </div>
          <button type="submit" className="btn-salvar">Cadastrar Cupom</button>
          <span id="mensagem-cadastro"></span>
        </form>
      </div>
    </div>
  );
};

export default Cupons;