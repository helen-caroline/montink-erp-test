async function carregarProdutos() {
    const response = await fetch('http://localhost:8000/produtos/view');
    const data = await response.json();

    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';

    if (data.produtos && data.produtos.length > 0) {
        data.produtos.forEach(produto => {
            // Monta string das variações com botão de deletar
            let variacoesStr = '-';
            if (produto.variacoes && produto.variacoes.length > 0) {
                variacoesStr = produto.variacoes.map(v => `
                    <span class="variacao-list-item">
                        <span class="variacao-nome-valor">${v.nome}: ${v.valor}</span>
                        <button class="btn-deletar-variacao" data-id="${v.id}" title="Deletar variação">🗑️</button>
                    </span>
                `).join('<br>');
            }
    
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${variacoesStr}</td>
                <td>
                    <button class="btn-deletar" data-id="${produto.id}">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    
        // Adiciona evento aos botões de deletar produto
        document.querySelectorAll('.btn-deletar').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja deletar este produto?')) {
                    const resp = await fetch('http://localhost:8000/produtos/delete', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    if (resp.ok) {
                        carregarProdutos();
                    } else {
                        alert('Erro ao deletar produto.');
                    }
                }
            });
        });
    
        // Adiciona evento aos botões de deletar variação
        document.querySelectorAll('.btn-deletar-variacao').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                if (confirm('Deseja realmente deletar esta variação?')) {
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
                }
            });
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado.</td></tr>';
    }
}

document.getElementById('btn-refresh').addEventListener('click', carregarProdutos);

// Adicionar/remover variações dinamicamente
document.getElementById('adicionar-variacao').addEventListener('click', function() {
    const container = document.getElementById('variacoes-container');
    const row = document.createElement('div');
    row.className = 'variacao-row';
    row.innerHTML = `
        <input type="text" class="variacao-nome" placeholder="Nome da variação (ex: Personalizado)">
        <input type="text" class="variacao-valor" placeholder="Valor (ex: Nome do cliente)">
        <button type="button" class="remover-variacao">Remover</button>
    `;
    row.querySelector('.remover-variacao').onclick = () => row.remove();
    container.appendChild(row);
});

// Evento de submit do formulário de cadastro de produto
document.getElementById('form-cadastrar-produto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;
    const cor = document.getElementById('cor').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;

    // Coletar variações personalizadas
    const variacoes = [];
    document.querySelectorAll('.variacao-row').forEach(row => {
        const nomeVar = row.querySelector('.variacao-nome').value;
        const valorVar = row.querySelector('.variacao-valor').value;
        if (nomeVar && valorVar) {
            variacoes.push({
                nome: nomeVar,
                valor: valorVar
            });
        }
    });

    const mensagemDiv = document.getElementById('mensagem-cadastro');

    const response = await fetch('http://localhost:8000/produtos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, estoque, cor, modelo, marca, variacoes })
    });

    if (response.ok) {
        mensagemDiv.textContent = 'Produto cadastrado com sucesso!';
        mensagemDiv.style.color = 'green';
        document.getElementById('form-cadastrar-produto').reset();
        carregarProdutos();
    } else {
        mensagemDiv.textContent = 'Erro ao cadastrar produto.';
        mensagemDiv.style.color = 'red';
    }
});

carregarProdutos();