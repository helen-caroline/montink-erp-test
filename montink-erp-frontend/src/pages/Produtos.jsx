import React, { useEffect, useState } from 'react';
import '../css/estoque.css';

const Estoque = () => {
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

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await fetch('http://localhost:8000/produtos/view-todos');
            const data = await response.json();
            setProdutos(data.produtos || []);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const adicionarVariacao = () => {
        setVariacoes([...variacoes, { nome: '', valor: '' }]);
    };

    const removerVariacao = (index) => {
        const novasVariacoes = [...variacoes];
        novasVariacoes.splice(index, 1);
        setVariacoes(novasVariacoes);
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
                setMensagemCadastro({ text: 'Produto cadastrado com sucesso!', color: 'green' });
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
            } else {
                setMensagemCadastro({ text: 'Erro ao cadastrar produto.', color: 'red' });
            }
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            setMensagemCadastro({ text: 'Erro ao cadastrar produto.', color: 'red' });
        }
    };

    const handleSelecionarTodos = (e) => {
        const isChecked = e.target.checked;
        setSelecionarTodos(isChecked);
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
        const selecionados = document.querySelectorAll('.selecionar-produto:checked');
        if (selecionados.length === 0) {
            alert('Selecione pelo menos um produto para excluir.');
            return;
        }
        if (!window.confirm(`Deseja realmente excluir ${selecionados.length} produto(s)?`)) return;

        try {
            for (const cb of selecionados) {
                const id = cb.getAttribute('data-id');
                await fetch('http://localhost:8000/produtos/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
            }
            carregarProdutos();
            setSelecionarTodos(false);
        } catch (error) {
            console.error('Erro ao excluir produtos:', error);
        }
    };

    return (
        <div className="container">
            <h1>Produtos</h1>
            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === 'lista' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('lista')}
                    data-tab="lista"
                >
                    Lista de Produtos
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'cadastro' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('cadastro')}
                    data-tab="cadastro"
                >
                    Cadastrar Produto
                </button>
            </div>
            
            {activeTab === 'lista' && (
                <div id="tab-lista" className="tab-content active">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <button 
                            id="btn-excluir-selecionados" 
                            className="btn-deletar" 
                            style={{ marginBottom: '0' }}
                            onClick={handleExcluirSelecionados}
                        >
                            Excluir Selecionados
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox" 
                                        id="selecionar-todos" 
                                        title="Selecionar todos"
                                        checked={selecionarTodos}
                                        onChange={handleSelecionarTodos}
                                    />
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
                            {produtos.length > 0 ? (
                                produtos.map(produto => (
                                    <tr key={produto.id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                className="selecionar-produto" 
                                                data-id={produto.id}
                                            />
                                        </td>
                                        <td>{produto.id}</td>
                                        <td>{produto.nome}</td>
                                        <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                                        <td>{produto.estoque}</td>
                                        <td>
                                            {produto.variacoes && produto.variacoes.length > 0 ? (
                                                produto.variacoes.map(v => (
                                                    <div key={v.id} className="variacao-list-item">
                                                        <span className="variacao-nome-valor">{v.nome}: {v.valor}</span>
                                                        <button 
                                                            className="btn-deletar-variacao" 
                                                            data-id={v.id} 
                                                            title="Deletar variação"
                                                            onClick={() => handleDeletarVariacao(v.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {produto.cupons && produto.cupons.length > 0 ? (
                                                produto.cupons.map(c => (
                                                    <div key={c.id} className="cupom-list-item">
                                                        <span 
                                                            className="cupom-nome-valor" 
                                                            title={`Desconto: R$ ${parseFloat(c.desconto).toFixed(2)}`}
                                                        >
                                                            [{c.id}] {c.codigo}
                                                        </span>
                                                        <button 
                                                            className="btn-deletar-cupom-produto" 
                                                            data-cupom-id={c.id} 
                                                            data-produto-id={produto.id}
                                                            title="Desvincular cupom"
                                                            onClick={() => handleDesvincularCupom(c.id, produto.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">Nenhum produto encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {activeTab === 'cadastro' && (
                <div id="tab-cadastro" className="tab-content">
                    <h3>Cadastrar Produto</h3>
                    {mensagemCadastro.text && (
                        <div id="mensagem-cadastro" style={{ color: mensagemCadastro.color }}>
                            {mensagemCadastro.text}
                        </div>
                    )}
                    <form id="form-cadastrar-produto" onSubmit={handleSubmit}>
                        <div className="campo">
                            <label htmlFor="nome">Nome do Produto</label>
                            <input 
                                type="text" 
                                id="nome" 
                                name="nome" 
                                value={formData.nome}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="preco">Preço (R$)</label>
                            <input 
                                type="number" 
                                id="preco" 
                                name="preco" 
                                value={formData.preco}
                                onChange={handleInputChange}
                                step="0.01" 
                                min="0" 
                                required 
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="estoque">Estoque</label>
                            <input 
                                type="number" 
                                id="estoque" 
                                name="estoque" 
                                value={formData.estoque}
                                onChange={handleInputChange}
                                min="0" 
                                required 
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="cor">Cor</label>
                            <input 
                                type="text" 
                                id="cor" 
                                name="cor" 
                                value={formData.cor}
                                onChange={handleInputChange}
                                placeholder="(ex: Azul)" 
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="modelo">Modelo</label>
                            <input 
                                type="text" 
                                id="modelo" 
                                name="modelo" 
                                value={formData.modelo}
                                onChange={handleInputChange}
                                placeholder="(ex: Slim)" 
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="marca">Marca</label>
                            <input 
                                type="text" 
                                id="marca" 
                                name="marca" 
                                value={formData.marca}
                                onChange={handleInputChange}
                                placeholder="(ex: Montink)" 
                            />
                        </div>
                        <div className="campo">
                            <label>Variações Personalizadas:</label>
                            <div id="variacoes-container">
                                {variacoes.map((variacao, index) => (
                                    <div key={index} className="variacao-row">
                                        <input 
                                            type="text" 
                                            className="variacao-nome" 
                                            placeholder="Nome da variação (ex: Personalizado)"
                                            value={variacao.nome}
                                            onChange={(e) => handleVariacaoChange(index, 'nome', e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            className="variacao-valor" 
                                            placeholder="Valor (ex: Nome do cliente)"
                                            value={variacao.valor}
                                            onChange={(e) => handleVariacaoChange(index, 'valor', e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="remover-variacao"
                                            onClick={() => removerVariacao(index)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button 
                                type="button" 
                                id="adicionar-variacao"
                                onClick={adicionarVariacao}
                            >
                                Adicionar Variação
                            </button>
                        </div>
                        <button type="submit" className="btn-salvar">Cadastrar</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Estoque;