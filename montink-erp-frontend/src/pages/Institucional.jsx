// Institucional.jsx
import React, { useEffect, useState } from 'react';
import '../css/institucional.css';

const API = 'http://localhost:8000';

const Institucional = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [descontoCupom, setDescontoCupom] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [mensagemCupom, setMensagemCupom] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    fetch(API + '/produtos/view')
      .then(res => res.json())
      .then(data => setProdutos(data.produtos || []));
  }, []);

  const adicionarCarrinho = (produto) => {
    const qtd = parseInt(document.getElementById('qtd_' + produto.id).value, 10);
    if (qtd < 1) return;
    setCarrinho(prev => {
      const idx = prev.findIndex(i => i.produto_id === produto.id);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx].quantidade += qtd;
        return novo;
      }
      return [...prev, { ...produto, produto_id: produto.id, quantidade: qtd }];
    });
  };

  const removerCarrinho = (produto_id) => {
    setCarrinho(prev => prev.filter(p => p.produto_id !== produto_id));
  };

  const aplicarCupom = async () => {
    setMensagemCupom('');
    setDescontoCupom(0);
    setCupomAplicado(null);
    if (!cupom) return setMensagemCupom('Digite um código de cupom.');

    const resp = await fetch(API + '/cupons/view');
    const data = await resp.json();
    const c = (data.cupons || []).find(c => c.codigo.toLowerCase() === cupom.toLowerCase());
    if (!c) return setMensagemCupom('Cupom não encontrado.');

    const vinculado = carrinho.some(item => {
      const prod = produtos.find(p => p.id === item.produto_id);
      return prod?.cupons?.some(cup => cup.codigo.toLowerCase() === cupom.toLowerCase());
    });
    if (!vinculado) return setMensagemCupom('Cupom não está vinculado a nenhum produto do carrinho.');

    const hoje = new Date().toISOString().slice(0, 10);
    if (c.validade && c.validade < hoje) return setMensagemCupom('Cupom expirado.');

    const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0) + 50;
    if (total < parseFloat(c.valor_minimo))
      return setMensagemCupom(`Valor mínimo para usar este cupom: R$ ${parseFloat(c.valor_minimo).toFixed(2)}`);

    setDescontoCupom(Math.abs(parseFloat(c.desconto)));
    setCupomAplicado(c);
    setMensagemCupom(`Cupom aplicado: ${c.codigo} (-R$ ${parseFloat(c.desconto).toFixed(2)})`);
  };

  const totalCarrinho = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0) + 50;
  const totalFinal = Math.max(0, totalCarrinho - descontoCupom);

  const enviarPedido = async (e) => {
    e.preventDefault();
    const form = e.target;
    const pedido = {
      frete: 50,
      total: totalFinal,
      status: 'Pendente',
      endereco: form.endereco.value,
      cep: form.cep.value,
      email: form.email.value,
      cupom_codigo: cupomAplicado?.codigo || '',
      produtos: carrinho.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
    };
    const resp = await fetch(API + '/pedidos/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
    if (resp.ok) {
      setMensagem('Pedido realizado com sucesso!');
      setCarrinho([]);
      setCupomAplicado(null);
      setDescontoCupom(0);
      form.reset();
      setModalAberto(false);
    } else {
      const erro = await resp.json().catch(() => ({}));
      setMensagem('Erro: ' + (erro.error || 'Erro ao criar pedido'));
      if (erro.error?.toLowerCase().includes('cupom')) setMensagemCupom(erro.error);
    }
  };

  return (
    <>
      <div className="container-flex">
        <div className="coluna" id="col-catalogo">
          <h1>Monte seu Pedido</h1>
          <h2>Catálogo de Produtos</h2>
          <div id="catalogo-produtos">
            {produtos.map(prod => (
              <div className="produto" key={prod.id}>
                <div className="produto-info">
                  <span className="produto-nome">{prod.nome}</span>
                  <span className="produto-preco">R$ {Number(prod.preco).toFixed(2)} {prod.marca && `- ${prod.marca}`}</span>
                </div>
                <div className="produto-controles">
                  <input type="number" id={`qtd_${prod.id}`} defaultValue={1} min={1} />
                  <button onClick={() => adicionarCarrinho(prod)}>Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="coluna" id="col-carrinho">
          <h2>Carrinho</h2>
          <div id="carrinho">
            {carrinho.length === 0 ? (
              <i>Carrinho vazio</i>
            ) : (
              <>
                {carrinho.map(item => (
                  <div key={item.produto_id}>
                    {item.nome} x{item.quantidade} - R$ {(item.preco * item.quantidade).toFixed(2)}
                    <button onClick={() => removerCarrinho(item.produto_id)} style={{ marginLeft: 8 }}>x</button>
                  </div>
                ))}
                <div><b>Frete:</b> R$ 50,00</div>
                {cupomAplicado && <div style={{ color: '#4fc3f7' }}><b>Cupom aplicado:</b> {cupomAplicado.codigo} (-R$ {descontoCupom.toFixed(2)})</div>}
                <div><b>Total:</b> R$ {totalFinal.toFixed(2)}</div>
              </>
            )}
          </div>
          <button id="btn-finalizar" onClick={() => setModalAberto(true)} style={{ width: '100%', marginTop: '18px' }}>Finalizar Pedido</button>
          <button id="btn-erp" onClick={() => window.location.href = '../public/index.html'} style={{ width: '100%', marginTop: '18px' }}>ERP</button>
          <div id="mensagem">{mensagem}</div>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-bg" id="modal-bg" onClick={e => e.target.id === 'modal-bg' && setModalAberto(false)}>
          <div className="modal">
            <span className="modal-close" id="fechar-modal" onClick={() => setModalAberto(false)}>&times;</span>
            <h2>Dados para Entrega</h2>
            <form id="form-pedido" onSubmit={enviarPedido}>
              <label>Email: <input type="email" name="email" required /></label><br />
              <label>Endereço: <input type="text" name="endereco" required /></label><br />
              <label>CEP: <input type="text" name="cep" required /></label><br />
              <label>
                Cupom:
                <input type="text" name="cupom_codigo" id="input-cupom" value={cupom} onChange={e => setCupom(e.target.value)} placeholder="Código do cupom" />
                <button type="button" id="btn-aplicar-cupom" onClick={aplicarCupom} style={{ marginLeft: 8 }}>Aplicar Cupom</button>
              </label>
              <div id="mensagem-cupom" style={{ color: descontoCupom ? '#4fc3f7' : '#e74c3c', fontSize: '0.97em', marginBottom: 8 }}>{mensagemCupom}</div>
              <button type="submit">Enviar Pedido</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Institucional;
