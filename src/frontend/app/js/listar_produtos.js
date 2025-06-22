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

carregarProdutos();