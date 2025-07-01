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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await fetch(`${API}/produtos/view`);
      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarCarrinho = (produto) => {
    const qtdElement = document.getElementById('qtd_' + produto.id);
    const qtd = parseInt(qtdElement.value, 10);
    
    if (qtd < 1) {
      alert('Quantidade deve ser maior que 0');
      return;
    }

    setCarrinho(prev => {
      const idx = prev.findIndex(i => i.produto_id === produto.id);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx].quantidade += qtd;
        return novo;
      }
      return [...prev, { ...produto, produto_id: produto.id, quantidade: qtd }];
    });

    // Reset quantity input
    qtdElement.value = 1;
    
    // Show success message
    setMensagem('Produto adicionado ao carrinho!');
    setTimeout(() => setMensagem(''), 3000);
  };

  const removerCarrinho = (produto_id) => {
    setCarrinho(prev => prev.filter(p => p.produto_id !== produto_id));
  };

  const alterarQuantidade = (produto_id, novaQuantidade) => {
    if (novaQuantidade < 1) {
      removerCarrinho(produto_id);
      return;
    }
    
    setCarrinho(prev => prev.map(item => 
      item.produto_id === produto_id 
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const aplicarCupom = async () => {
    setMensagemCupom('');
    setDescontoCupom(0);
    setCupomAplicado(null);
    
    if (!cupom.trim()) {
      setMensagemCupom('Digite um código de cupom.');
      return;
    }

    try {
      const resp = await fetch(`${API}/cupons/view`);
      const data = await resp.json();
      const c = (data.cupons || []).find(c => c.codigo.toLowerCase() === cupom.toLowerCase());
      
      if (!c) {
        setMensagemCupom('Cupom não encontrado.');
        return;
      }

      // Verificar se o cupom está vinculado a algum produto do carrinho
      const vinculado = carrinho.some(item => {
        const prod = produtos.find(p => p.id === item.produto_id);
        return prod?.cupons?.some(cup => cup.codigo.toLowerCase() === cupom.toLowerCase());
      });
      
      if (!vinculado) {
        setMensagemCupom('Cupom não está vinculado a nenhum produto do carrinho.');
        return;
      }

      // Verificar validade
      const hoje = new Date().toISOString().slice(0, 10);
      if (c.validade && c.validade < hoje) {
        setMensagemCupom('Cupom expirado.');
        return;
      }

      // Verificar valor mínimo
      const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
      if (subtotal < parseFloat(c.valor_minimo)) {
        setMensagemCupom(`Valor mínimo para usar este cupom: R$ ${parseFloat(c.valor_minimo).toFixed(2)}`);
        return;
      }

      setDescontoCupom(Math.abs(parseFloat(c.desconto)));
      setCupomAplicado(c);
      setMensagemCupom(`Cupom aplicado com sucesso!`);
    } catch (error) {
      setMensagemCupom('Erro ao verificar cupom.');
    }
  };

  const calcularTotais = () => {
    const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const frete = subtotal > 0 ? 50 : 0;
    const total = Math.max(0, subtotal + frete - descontoCupom);
    
    return { subtotal, frete, total };
  };

  const { subtotal, frete, total } = calcularTotais();

  const enviarPedido = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const pedido = {
      frete: frete,
      total: total,
      status: 'Pendente',
      endereco: form.endereco.value,
      cep: form.cep.value,
      email: form.email.value,
      cupom_codigo: cupomAplicado?.codigo || '',
      produtos: carrinho.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
    };

    try {
      const resp = await fetch(`${API}/pedidos/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (resp.ok) {
        setMensagem('🎉 Pedido realizado com sucesso! Obrigado pela sua compra!');
        setCarrinho([]);
        setCupomAplicado(null);
        setDescontoCupom(0);
        setCupom('');
        form.reset();
        setModalAberto(false);
      } else {
        const erro = await resp.json().catch(() => ({}));
        setMensagem('❌ ' + (erro.error || 'Erro ao criar pedido'));
        if (erro.error?.toLowerCase().includes('cupom')) {
          setMensagemCupom(erro.error);
        }
      }
    } catch (error) {
      setMensagem('❌ Erro ao enviar pedido. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="loja-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loja-container">
      <header className="loja-header">
        <div className="loja-brand">
          <h1>🛍️ Montink Store</h1>
          <p>Produtos de qualidade com os melhores preços</p>
        </div>
        <div className="carrinho-badge">
          <span className="carrinho-icon">🛒</span>
          <span className="carrinho-count">{carrinho.reduce((total, item) => total + item.quantidade, 0)}</span>
        </div>
      </header>

      {mensagem && (
        <div className={`mensagem-global ${mensagem.includes('❌') ? 'erro' : 'sucesso'}`}>
          {mensagem}
        </div>
      )}

      <div className="loja-content">
        <main className="catalogo-section">
          <div className="section-header">
            <h2>🏪 Nossos Produtos</h2>
            <p>Escolha os melhores produtos para você</p>
          </div>

          <div className="produtos-grid">
            {produtos.length > 0 ? (
              produtos.map(produto => (
                <div className="produto-card" key={produto.id}>
                  <div className="produto-badge">Disponível</div>
                  <div className="produto-info">
                    <h3 className="produto-nome">{produto.nome}</h3>
                    {produto.marca && <p className="produto-marca">Marca: {produto.marca}</p>}
                    {produto.cor && <p className="produto-cor">Cor: {produto.cor}</p>}
                    {produto.modelo && <p className="produto-modelo">Modelo: {produto.modelo}</p>}
                    <div className="produto-preco">
                      <span className="preco-valor">R$ {Number(produto.preco).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="produto-actions">
                    <div className="quantidade-selector">
                      <label>Quantidade:</label>
                      <input 
                        type="number" 
                        id={`qtd_${produto.id}`} 
                        defaultValue={1} 
                        min={1} 
                        className="quantidade-input"
                      />
                    </div>
                    <button 
                      className="btn-adicionar"
                      onClick={() => adicionarCarrinho(produto)}
                    >
                      ➕ Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <h3>Nenhum produto disponível</h3>
                <p>Em breve teremos novos produtos para você!</p>
              </div>
            )}
          </div>
        </main>

        <aside className="carrinho-section">
          <div className="carrinho-header">
            <h2>🛒 Seu Carrinho</h2>
            <span className="items-count">({carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'})</span>
          </div>

          <div className="carrinho-content">
            {carrinho.length === 0 ? (
              <div className="carrinho-vazio">
                <span className="empty-cart-icon">🛒</span>
                <p>Seu carrinho está vazio</p>
                <small>Adicione produtos para continuar</small>
              </div>
            ) : (
              <>
                <div className="carrinho-items">
                  {carrinho.map(item => (
                    <div className="carrinho-item" key={item.produto_id}>
                      <div className="item-info">
                        <h4>{item.nome}</h4>
                        <p className="item-preco">R$ {Number(item.preco).toFixed(2)} cada</p>
                      </div>
                      <div className="item-controls">
                        <div className="quantidade-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => alterarQuantidade(item.produto_id, item.quantidade - 1)}
                          >
                            −
                          </button>
                          <span className="quantidade">{item.quantidade}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => alterarQuantidade(item.produto_id, item.quantidade + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="btn-remover"
                          onClick={() => removerCarrinho(item.produto_id)}
                          title="Remover item"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="item-total">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="carrinho-resumo">
                  <div className="resumo-linha">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="resumo-linha">
                    <span>Frete:</span>
                    <span>R$ {frete.toFixed(2)}</span>
                  </div>
                  {cupomAplicado && (
                    <div className="resumo-linha cupom-aplicado">
                      <span>Cupom ({cupomAplicado.codigo}):</span>
                      <span>-R$ {descontoCupom.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="resumo-linha total">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className="btn-finalizar"
                  onClick={() => setModalAberto(true)}
                >
                  🛍️ Finalizar Pedido
                </button>
              </>
            )}
          </div>
        </aside>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && setModalAberto(false)}>
          <div className="modal-checkout">
            <div className="modal-header">
              <h2>📋 Finalizar Pedido</h2>
              <button 
                className="modal-close"
                onClick={() => setModalAberto(false)}
              >
                ×
              </button>
            </div>

            <form className="checkout-form" onSubmit={enviarPedido}>
              <div className="form-section">
                <h3>📧 Dados de Contato</h3>
                <div className="form-group">
                  <label>Email:</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>📍 Endereço de Entrega</h3>
                <div className="form-group">
                  <label>Endereço completo:</label>
                  <input 
                    type="text" 
                    name="endereco" 
                    required 
                    placeholder="Rua, número, complemento, bairro, cidade"
                  />
                </div>
                <div className="form-group">
                  <label>CEP:</label>
                  <input 
                    type="text" 
                    name="cep" 
                    required 
                    placeholder="00000-000"
                    maxLength="9"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>🎫 Cupom de Desconto</h3>
                <div className="cupom-group">
                  <input 
                    type="text" 
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    placeholder="Digite o código do cupom"
                    className="cupom-input"
                  />
                  <button 
                    type="button" 
                    className="btn-aplicar-cupom"
                    onClick={aplicarCupom}
                  >
                    Aplicar
                  </button>
                </div>
                {mensagemCupom && (
                  <div className={`cupom-mensagem ${cupomAplicado ? 'sucesso' : 'erro'}`}>
                    {mensagemCupom}
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>💰 Resumo do Pedido</h3>
                <div className="resumo-final">
                  <div className="resumo-linha">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="resumo-linha">
                    <span>Frete:</span>
                    <span>R$ {frete.toFixed(2)}</span>
                  </div>
                  {cupomAplicado && (
                    <div className="resumo-linha cupom-aplicado">
                      <span>Desconto:</span>
                      <span>-R$ {descontoCupom.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="resumo-linha total-final">
                    <span>Total a pagar:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-confirmar"
                >
                  🎉 Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Institucional;