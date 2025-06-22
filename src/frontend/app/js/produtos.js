async function carregarProdutos() {
    const response = await fetch('http://localhost:8000/produtos/view');
    const data = await response.json();

    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';

    if (data.produtos && data.produtos.length > 0) {
        data.produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque ?? '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum produto encontrado.</td></tr>';
    }
}

document.getElementById('btn-refresh').addEventListener('click', carregarProdutos);

document.getElementById('form-cadastrar-produto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;
    const mensagemDiv = document.getElementById('mensagem-cadastro');

    const response = await fetch('http://localhost:8000/produtos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, estoque })
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