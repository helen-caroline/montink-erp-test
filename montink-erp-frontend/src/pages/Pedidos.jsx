// Pedidos.jsx
import React from 'react';
import '../css/pedidos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Pedidos = () => {
  return (
    <>
      <div className="container">
        <div className="header-pedidos">
          <h1><i className="fa-solid fa-box-open"></i> Pedidos</h1>
          <button id="btn-excluir-selecionados-pedidos" className="btn-deletar">
            <i className="fa-solid fa-trash"></i> Excluir Selecionados
          </button>
        </div>

        <div className="tabela-wrapper">
          <table id="tabela-pedidos">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" id="selecionar-todos-pedidos" title="Selecionar todos" />
                </th>
                <th>ID</th>
                <th><i className="fa-solid fa-user"></i> Cliente</th>
                <th><i className="fa-solid fa-clipboard-check"></i> Status</th>
                <th><i className="fa-solid fa-money-bill-wave"></i> Total</th>
                <th><i className="fa-solid fa-calendar-day"></i> Data</th>
                <th><i className="fa-solid fa-gear"></i> Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Linhas dos pedidos serão renderizadas dinamicamente aqui */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Pedido */}
      <div className="modal-bg" id="modal-bg">
        <div className="modal" id="modal-pedido">
          <span className="modal-close" id="fechar-modal">&times;</span>
          <h2><i className="fa-solid fa-receipt"></i> Detalhes do Pedido</h2>
          <div id="detalhes-pedido">
            {/* Detalhes serão preenchidos via lógica JS */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pedidos;