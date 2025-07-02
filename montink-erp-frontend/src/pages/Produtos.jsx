import React, { useEffect, useState } from 'react';
import '../css/estoque.css';

const Produtos = () => {
    const [activeTab, setActiveTab] = useState('lista');
    const [produtos, setProdutos] = useState([]);
    const [variacoes, setVariacoes] = useState([{ nome: '', valor: '' }]);
    const [formData, setFormData] = useState({
        nome: '',
        preco: '',
        estoque: '',
        cor: '',
        modelo: '',
        marca: ''
    });
    const [mensagemCadastro, setMensagemCadastro] = useState({ text: '', color: '' });
    const [selecionarTodos, setSelecionarTodos] = useState(false);
    const [produtosSelecionados, setProdutosSelecionados] = useState(new Set());
    const [estoqueEditando, setEstoqueEditando] = useState({}); // Novo estado para controlar edição

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await fetch('http://localhost:8000/produtos/view-todos');
            const data = await response.json();
            setProdutos(data.produtos || []);
            setProdutosSelecionados(new Set());
            setSelecionarTodos(false);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    // Nova função para atualizar estoque
    const atualizarEstoque = async (produtoId, novoEstoque) => {
        try {
            console.log('Atualizando estoque:', { produtoId, novoEstoque });
            
            const response = await fetch(`http://localhost:8000/produtos/update/${produtoId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    estoque: parseInt(novoEstoque) 
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (response.ok) {
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Erro ao fazer parse do JSON:', parseError);
                    throw new Error('Resposta inválida do servidor');
                }
                
                // Atualizar produto localmente
                setProdutos(prev => prev.map(p => 
                    p.id === produtoId 
                        ? { ...p, estoque: parseInt(novoEstoque) }
                        : p
                ));
                
                // Remover do estado de edição
                setEstoqueEditando(prev => {
                    const novo = { ...prev };
                    delete novo[produtoId];
                    return novo;
                });
                
                // Mostrar mensagem de sucesso
                setMensagemCadastro({ 
                    text: '✅ Estoque atualizado com sucesso!', 
                    color: 'success' 
                });
                
                // Remover mensagem após 3 segundos
                setTimeout(() => {
                    setMensagemCadastro({ text: '', color: '' });
                }, 3000);
            } else {
                console.error('Erro na resposta:', responseText);
                setMensagemCadastro({ 
                    text: '❌ Erro ao atualizar estoque', 
                    color: 'error' 
                });
                carregarProdutos(); // Recarregar para reverter mudanças
            }
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
            setMensagemCadastro({ 
                text: '❌ Erro de conexão ao atualizar estoque', 
                color: 'error' 
            });
            carregarProdutos();
            
            // Remover mensagem após 5 segundos
            setTimeout(() => {
                setMensagemCadastro({ text: '', color: '' });
            }, 5000);
        }
    };

    // Função para iniciar edição do estoque
    const iniciarEdicaoEstoque = (produtoId, estoqueAtual) => {
        setEstoqueEditando(prev => ({
            ...prev,
            [produtoId]: estoqueAtual.toString()
        }));
    };

    // Função para cancelar edição
    const cancelarEdicaoEstoque = (produtoId) => {
        setEstoqueEditando(prev => {
            const novo = { ...prev };
            delete novo[produtoId];
            return novo;
        });
    };

    // Função para salvar estoque (Enter ou blur)
    const salvarEstoque = (produtoId) => {
        const novoEstoque = estoqueEditando[produtoId];
        if (novoEstoque !== undefined && novoEstoque !== '') {
            const valor = parseInt(novoEstoque);
            if (!isNaN(valor) && valor >= 0) {
                atualizarEstoque(produtoId, valor);
            } else {
                setMensagemCadastro({ 
                    text: '❌ Digite um número válido maior ou igual a 0', 
                    color: 'error' 
                });
                cancelarEdicaoEstoque(produtoId);
                
                // Remover mensagem após 3 segundos
                setTimeout(() => {
                    setMensagemCadastro({ text: '', color: '' });
                }, 3000);
            }
        } else {
            cancelarEdicaoEstoque(produtoId);
        }
    };

    // Função para lidar com mudanças no input de estoque
    const handleEstoqueChange = (produtoId, valor) => {
        setEstoqueEditando(prev => ({
            ...prev,
            [produtoId]: valor
        }));
    };

    // Função para lidar com teclas no input de estoque
    const handleEstoqueKeyPress = (e, produtoId) => {
        if (e.key === 'Enter') {
            salvarEstoque(produtoId);
        } else if (e.key === 'Escape') {
            cancelarEdicaoEstoque(produtoId);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMensagemCadastro({ text: '', color: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const adicionarVariacao = () => {
        setVariacoes([...variacoes, { nome: '', valor: '' }]);
    };

    const removerVariacao = (index) => {
        if (variacoes.length > 1) {
            const novasVariacoes = [...variacoes];
            novasVariacoes.splice(index, 1);
            setVariacoes(novasVariacoes);
        }
    };

    const handleVariacaoChange = (index, field, value) => {
        const novasVariacoes = [...variacoes];
        novasVariacoes[index][field] = value;
        setVariacoes(novasVariacoes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const variacoesFiltradas = variacoes.filter(v => v.nome && v.valor);
            
            const response = await fetch('http://localhost:8000/produtos/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, variacoes: variacoesFiltradas })
            });

            if (response.ok) {
                setMensagemCadastro({ text: 'Produto cadastrado com sucesso!', color: 'success' });
                setFormData({
                    nome: '',
                    preco: '',
                    estoque: '',
                    cor: '',
                    modelo: '',
                    marca: ''
                });
                setVariacoes([{ nome: '', valor: '' }]);
                carregarProdutos();
                
                setTimeout(() => {
                    setMensagemCadastro({ text: '', color: '' });
                }, 3000);
            } else {
                setMensagemCadastro({ text: 'Erro ao cadastrar produto.', color: 'error' });
            }
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            setMensagemCadastro({ text: 'Erro ao cadastrar produto.', color: 'error' });
        }
    };

    const handleSelecionarTodos = (e) => {
        const isChecked = e.target.checked;
        setSelecionarTodos(isChecked);
        
        if (isChecked) {
            const todosProdutos = new Set(produtos.map(p => p.id));
            setProdutosSelecionados(todosProdutos);
        } else {
            setProdutosSelecionados(new Set());
        }
    };

    const handleSelecionarProduto = (produtoId) => {
        const novosSelecionados = new Set(produtosSelecionados);
        
        if (novosSelecionados.has(produtoId)) {
            novosSelecionados.delete(produtoId);
        } else {
            novosSelecionados.add(produtoId);
        }
        
        setProdutosSelecionados(novosSelecionados);
        setSelecionarTodos(novosSelecionados.size === produtos.length && produtos.length > 0);
    };

    const handleDeletarVariacao = async (id) => {
        if (window.confirm('Deseja realmente deletar esta variação?')) {
            try {
                const resp = await fetch('http://localhost:8000/produtos/variacao/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                if (resp.ok) {
                    carregarProdutos();
                } else {
                    alert('Erro ao deletar variação.');
                }
            } catch (error) {
                console.error('Erro ao deletar variação:', error);
            }
        }
    };

    const handleDesvincularCupom = async (cupom_id, produto_id) => {
        if (window.confirm('Deseja realmente desvincular este cupom do produto?')) {
            try {
                const resp = await fetch('http://localhost:8000/produtos/cupom/desvincular', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cupom_id, produto_id })
                });
                if (resp.ok) {
                    carregarProdutos();
                } else {
                    alert('Erro ao desvincular cupom.');
                }
            } catch (error) {
                console.error('Erro ao desvincular cupom:', error);
            }
        }
    };

    const handleExcluirSelecionados = async () => {
        if (produtosSelecionados.size === 0) {
            alert('Selecione pelo menos um produto para excluir.');
            return;
        }
        
        if (!window.confirm(`Deseja realmente excluir ${produtosSelecionados.size} produto(s)?`)) return;

        try {
            for (const id of produtosSelecionados) {
                await fetch('http://localhost:8000/produtos/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
            }
            carregarProdutos();
        } catch (error) {
            console.error('Erro ao excluir produtos:', error);
        }
    };

    return (
        <div className="produtos-container">
            <div className="produtos-header">
                <h1>Gerenciamento de Produtos</h1>
                <p className="produtos-subtitle">
                    Gerencie seu estoque, cadastre novos produtos e mantenha seu inventário atualizado
                </p>
            </div>
            
            <div className="produtos-tabs">
                <button 
                    className={`produtos-tab-btn ${activeTab === 'lista' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('lista')}
                >
                    Lista de Produtos
                </button>
                <button 
                    className={`produtos-tab-btn ${activeTab === 'cadastro' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('cadastro')}
                >
                    Cadastrar Produto
                </button>
            </div>
            
            {activeTab === 'lista' && (
                <div className="produtos-tab-content active">
                    <div className="produtos-actions">
                        <h3>Lista de Produtos ({produtos.length})</h3>
                        <div className="produtos-actions-buttons">
                            <button 
                                className="btn btn-primary"
                                onClick={() => carregarProdutos()}
                            >
                                Atualizar
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={handleExcluirSelecionados}
                                disabled={produtosSelecionados.size === 0}
                            >
                                Excluir Selecionados ({produtosSelecionados.size})
                            </button>
                        </div>
                    </div>
                    
                    <div className="produtos-table-container">
                        <table className="produtos-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>
                                        <input 
                                            type="checkbox" 
                                            className="produtos-checkbox"
                                            checked={selecionarTodos}
                                            onChange={handleSelecionarTodos}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Preço</th>
                                    <th style={{ width: '120px' }}>Estoque</th>
                                    <th>Variações</th>
                                    <th>Cupons</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.length > 0 ? (
                                    produtos.map(produto => (
                                        <tr key={produto.id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    className="produtos-checkbox"
                                                    checked={produtosSelecionados.has(produto.id)}
                                                    onChange={() => handleSelecionarProduto(produto.id)}
                                                />
                                            </td>
                                            <td>#{produto.id}</td>
                                            <td style={{ fontWeight: '500' }}>{produto.nome}</td>
                                            <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                                            <td>
                                                {estoqueEditando[produto.id] !== undefined ? (
                                                    <div className="estoque-edit-container">
                                                        <input
                                                            type="number"
                                                            className="estoque-input"
                                                            value={estoqueEditando[produto.id]}
                                                            onChange={(e) => handleEstoqueChange(produto.id, e.target.value)}
                                                            onBlur={() => salvarEstoque(produto.id)}
                                                            onKeyDown={(e) => handleEstoqueKeyPress(e, produto.id)}
                                                            min="0"
                                                            autoFocus
                                                        />
                                                        <div className="estoque-actions">
                                                            <button 
                                                                className="estoque-save-btn"
                                                                onClick={() => salvarEstoque(produto.id)}
                                                                title="Salvar (Enter)"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button 
                                                                className="estoque-cancel-btn"
                                                                onClick={() => cancelarEdicaoEstoque(produto.id)}
                                                                title="Cancelar (Esc)"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        className="estoque-display"
                                                        onClick={() => iniciarEdicaoEstoque(produto.id, produto.estoque)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                iniciarEdicaoEstoque(produto.id, produto.estoque);
                                                            }
                                                        }}
                                                        title="Clique para editar estoque"
                                                        aria-label={`Editar estoque do produto ${produto.nome}, quantidade atual: ${produto.estoque}`}
                                                    >
                                                        <span className={`estoque-badge ${
                                                            produto.estoque > 10 ? 'success' : 
                                                            produto.estoque > 0 ? 'warning' : 'danger'
                                                        }`}>
                                                            {produto.estoque} un.
                                                        </span>
                                                        <span className="edit-icon">✏️</span>
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                {produto.variacoes && produto.variacoes.length > 0 ? (
                                                    <div className="produtos-items-list">
                                                        {produto.variacoes.map(v => (
                                                            <div key={v.id} className="produtos-item">
                                                                <span className="produtos-item-content">
                                                                    <strong>{v.nome}:</strong> {v.valor}
                                                                </span>
                                                                <button 
                                                                    className="produtos-delete-btn" 
                                                                    onClick={() => handleDeletarVariacao(v.id)}
                                                                    title="Deletar variação"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--gray-500)', fontSize: '13px' }}>
                                                        Nenhuma variação
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {produto.cupons && produto.cupons.length > 0 ? (
                                                    <div className="produtos-items-list">
                                                        {produto.cupons.map(c => (
                                                            <div key={c.id} className="produtos-item">
                                                                <span className="produtos-item-content">
                                                                    <strong>{c.codigo}</strong> (R$ {parseFloat(c.desconto).toFixed(2)})
                                                                </span>
                                                                <button 
                                                                    className="produtos-delete-btn" 
                                                                    onClick={() => handleDesvincularCupom(c.id, produto.id)}
                                                                    title="Desvincular cupom"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--gray-500)', fontSize: '13px' }}>
                                                        Nenhum cupom
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="produtos-empty">
                                                <h3>Nenhum produto encontrado</h3>
                                                <p>Comece cadastrando seu primeiro produto na aba "Cadastrar Produto"</p>
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
                <div className="produtos-tab-content active">
                    <div className="produtos-form-container">
                        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                            Cadastrar Novo Produto
                        </h3>
                        
                        {mensagemCadastro.text && (
                            <div className={`produtos-message produtos-message-${mensagemCadastro.color}`}>
                                {mensagemCadastro.text}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="produtos-form">
                                <div className="produtos-field">
                                    <label htmlFor="nome" className="produtos-label required">Nome do Produto</label>
                                    <input 
                                        type="text" 
                                        id="nome" 
                                        name="nome" 
                                        className="produtos-input"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        placeholder="Digite o nome do produto"
                                        required 
                                    />
                                </div>
                                
                                <div className="produtos-field">
                                    <label htmlFor="preco" className="produtos-label required">Preço (R$)</label>
                                    <input 
                                        type="number" 
                                        id="preco" 
                                        name="preco" 
                                        className="produtos-input"
                                        value={formData.preco}
                                        onChange={handleInputChange}
                                        placeholder="0,00"
                                        step="0.01" 
                                        min="0" 
                                        required 
                                    />
                                </div>
                                
                                <div className="produtos-field">
                                    <label htmlFor="estoque" className="produtos-label required">Estoque</label>
                                    <input 
                                        type="number" 
                                        id="estoque" 
                                        name="estoque" 
                                        className="produtos-input"
                                        value={formData.estoque}
                                        onChange={handleInputChange}
                                        placeholder="Quantidade disponível"
                                        min="0" 
                                        required 
                                    />
                                </div>
                                
                                <div className="produtos-field">
                                    <label htmlFor="cor" className="produtos-label">Cor</label>
                                    <input 
                                        type="text" 
                                        id="cor" 
                                        name="cor" 
                                        className="produtos-input"
                                        value={formData.cor}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Azul, Vermelho, Preto"
                                    />
                                </div>
                                
                                <div className="produtos-field">
                                    <label htmlFor="modelo" className="produtos-label">Modelo</label>
                                    <input 
                                        type="text" 
                                        id="modelo" 
                                        name="modelo" 
                                        className="produtos-input"
                                        value={formData.modelo}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Slim, Regular, Plus"
                                    />
                                </div>
                                
                                <div className="produtos-field">
                                    <label htmlFor="marca" className="produtos-label">Marca</label>
                                    <input 
                                        type="text" 
                                        id="marca" 
                                        name="marca" 
                                        className="produtos-input"
                                        value={formData.marca}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Nike, Adidas, Puma"
                                    />
                                </div>
                                
                                <div className="produtos-variations-container">
                                    <label className="produtos-label">Variações do Produto (Opcional)</label>
                                    <div className="produtos-variations">
                                        {variacoes.map((variacao, index) => (
                                            <div key={index} className="produtos-variation-row">
                                                <div className="produtos-field">
                                                    <input 
                                                        type="text" 
                                                        className="produtos-input"
                                                        placeholder="Nome da variação (ex: Tamanho)"
                                                        value={variacao.nome}
                                                        onChange={(e) => handleVariacaoChange(index, 'nome', e.target.value)}
                                                    />
                                                </div>
                                                <div className="produtos-field">
                                                    <input 
                                                        type="text" 
                                                        className="produtos-input"
                                                        placeholder="Valor (ex: G, M, P)"
                                                        value={variacao.valor}
                                                        onChange={(e) => handleVariacaoChange(index, 'valor', e.target.value)}
                                                    />
                                                </div>
                                                {variacoes.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        className="produtos-remove-btn"
                                                        onClick={() => removerVariacao(index)}
                                                    >
                                                        Remover
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline"
                                        onClick={adicionarVariacao}
                                        style={{ marginTop: '16px' }}
                                    >
                                        + Adicionar Variação
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setFormData({
                                            nome: '',
                                            preco: '',
                                            estoque: '',
                                            cor: '',
                                            modelo: '',
                                            marca: ''
                                        });
                                        setVariacoes([{ nome: '', valor: '' }]);
                                        setMensagemCadastro({ text: '', color: '' });
                                    }}
                                >
                                    Limpar Formulário
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Cadastrar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Produtos;