import React, { useState } from 'react';
import './estoque.css';
import './estoque/sub-menus.css';

const Estoque = () => {
  const [tab, setTab] = useState('lista');

  return (
    <div className="container">
      <h1>Produtos</h1>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'lista' ? 'active' : ''}`}
          onClick={() => setTab('lista')}
        >
          Lista de Produtos
        </button>
        <button
          className={`tab-btn ${tab === 'cadastro' ? 'active' : ''}`}
          onClick={() => setTab('cadastro')}
        >
          Cadastrar Produto
        </button>
      </div>

      {tab === 'lista' && (
        <div id="tab-lista" className="tab-content active">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button id="btn-excluir-selecionados" className="btn-deletar">
              Excluir Selecionados
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" id="selecionar-todos" title="Selecionar todos" />
                </th>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Variações</th>
                <th>Cupons</th>
              </tr>
            </thead>
            <tbody id="produtos-tbody">
              {/* Os produtos serão inseridos aqui via JavaScript */}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'cadastro' && (
        <div id="tab-cadastro" className="tab-content active">
          <h3>Cadastrar Produto</h3>
          <div id="mensagem-cadastro"></div>
          <form id="form-cadastrar-produto">
            <div className="campo">
              <label htmlFor="nome">Nome do Produto</label>
              <input type="text" id="nome" name="nome" required />
            </div>
            <div className="campo">
              <label htmlFor="preco">Preço (R$)</label>
              <input type="number" id="preco" name="preco" step="0.01" min="0" required />
            </div>
            <div className="campo">
              <label htmlFor="estoque">Estoque</label>
              <input type="number" id="estoque" name="estoque" min="0" required />
            </div>
            <div className="campo">
              <label htmlFor="cor">Cor</label>
              <input type="text" id="cor" name="cor" placeholder="(ex: Azul)" />
            </div>
            <div className="campo">
              <label htmlFor="modelo">Modelo</label>
              <input type="text" id="modelo" name="modelo" placeholder="(ex: Slim)" />
            </div>
            <div className="campo">
              <label htmlFor="marca">Marca</label>
              <input type="text" id="marca" name="marca" placeholder="(ex: Montink)" />
            </div>
            <div className="campo">
              <label>Variações Personalizadas:</label>
              <div id="variacoes-container">
                <div className="variacao-row">
                  <input type="text" className="variacao-nome" placeholder="Nome da variação (ex: Personalizado)" />
                  <input type="text" className="variacao-valor" placeholder="Valor (ex: Nome do cliente)" />
                  <button type="button" className="remover-variacao">Remover</button>
                </div>
              </div>
              <button type="button" id="adicionar-variacao">Adicionar Variação</button>
            </div>
            <button type="submit" className="btn-salvar">Cadastrar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Estoque;