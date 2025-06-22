document.querySelector('form').addEventListener('submit', async function(e) {
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
        document.querySelector('form').reset();
    } else {
        mensagemDiv.textContent = 'Erro ao cadastrar produto.';
        mensagemDiv.style.color = 'red';
    }
});