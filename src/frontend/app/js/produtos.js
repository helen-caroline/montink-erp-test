async function carregarProdutos() {
    const response = await fetch('http://localhost:8000/produtos/view');
    const data = await response.json();

    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';

    if (data.produtos && data.produtos.length > 0) {
        data.produtos.forEach(produto => {
            // Monta string das variações
            let variacoesStr = '-';
            if (produto.variacoes && produto.variacoes.length > 0) {
                variacoesStr = produto.variacoes.map(v => 
                    `${v.nome}: ${v.valor} (Estoque: ${v.quantidade})`
                ).join('<br>');
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque ?? '-'}</td>
                <td>${variacoesStr}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';
    }
}

document.getElementById('btn-refresh').addEventListener('click', carregarProdutos);

// Adicionar/remover variações dinamicamente
document.getElementById('adicionar-variacao').addEventListener('click', function() {
    const container = document.getElementById('variacoes-container');
    const row = document.createElement('div');
    row.className = 'variacao-row';
    row.innerHTML = `
        <input type="text" class="variacao-nome" placeholder="Nome da variação (ex: Cor)">
        <input type="text" class="variacao-valor" placeholder="Valor (ex: Azul)">
        <input type="number" class="variacao-estoque" placeholder="Estoque" min="0">
        <button type="button" class="remover-variacao">Remover</button>
    `;
    row.querySelector('.remover-variacao').onclick = () => row.remove();
    container.appendChild(row);
});

document.getElementById('form-cadastrar-produto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;

    // Coletar variações
    const variacoes = [];
    document.querySelectorAll('.variacao-row').forEach(row => {
        const nomeVar = row.querySelector('.variacao-nome').value;
        const valorVar = row.querySelector('.variacao-valor').value;
        const estoqueVar = row.querySelector('.variacao-estoque').value;
        if (nomeVar && valorVar && estoqueVar !== '') {
            variacoes.push({
                nome: nomeVar,
                valor: valorVar,
                estoque: parseInt(estoqueVar)
            });
        }
    });

    const mensagemDiv = document.getElementById('mensagem-cadastro');

    const response = await fetch('http://localhost:8000/produtos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, variacoes })
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