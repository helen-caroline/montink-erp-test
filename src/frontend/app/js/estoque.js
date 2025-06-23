async function carregarProdutos() {
    const response = await fetch('http://localhost:8000/produtos/view');
    const data = await response.json();

    const tbody = document.getElementById('produtos-tbody');
    if (!tbody) return;

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
    
            // Monta string dos cupons vinculados
            let cuponsStr = '-';
            if (produto.cupons && produto.cupons.length > 0) {
                cuponsStr = produto.cupons.map(c => 
                    `<span class="cupom-list-item">
                        <span class="cupom-nome-valor" title="Desconto: R$ ${parseFloat(c.desconto).toFixed(2)}">
                            [${c.id}] ${c.codigo}
                        </span>
                        <button class="btn-deletar-cupom-produto" data-cupom-id="${c.id}" data-produto-id="${produto.id}" title="Desvincular cupom">🗑️</button>
                    </span>`
                ).join('<br>');
            }
    
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="selecionar-produto" data-id="${produto.id}">
                </td>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${variacoesStr}</td>
                <td>${cuponsStr}</td>
            `;
            tbody.appendChild(tr);
        });

        // Seleção de todos
        const selecionarTodos = document.getElementById('selecionar-todos');
        if (selecionarTodos) {
            selecionarTodos.checked = false;
            selecionarTodos.onclick = function() {
                document.querySelectorAll('.selecionar-produto').forEach(cb => {
                    cb.checked = selecionarTodos.checked;
                    const tr = cb.closest('tr');
                    if (cb.checked) {
                        tr.classList.add('selected');
                    } else {
                        tr.classList.remove('selected');
                    }
                });
            };
        }

        // Atualiza o checkbox do topo se todos forem marcados/desmarcados individualmente
        document.querySelectorAll('.selecionar-produto').forEach(cb => {
            cb.addEventListener('change', function() {
                const all = document.querySelectorAll('.selecionar-produto');
                const checked = document.querySelectorAll('.selecionar-produto:checked');
                if (selecionarTodos) {
                    selecionarTodos.checked = all.length === checked.length;
                }
                // Realce visual da linha selecionada
                const tr = this.closest('tr');
                if (this.checked) {
                    tr.classList.add('selected');
                } else {
                    tr.classList.remove('selected');
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

        // Adiciona evento aos botões de deletar cupom vinculado ao produto
        document.querySelectorAll('.btn-deletar-cupom-produto').forEach(btn => {
            btn.addEventListener('click', async function(e) {
                e.stopPropagation();
                const cupom_id = this.getAttribute('data-cupom-id');
                const produto_id = this.getAttribute('data-produto-id');
                if (confirm('Deseja realmente desvincular este cupom do produto?')) {
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
                }
            });
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum produto encontrado.</td></tr>';
    }
}

// Após carregarProdutos() e fora da função carregarProdutos
const btnExcluirSelecionados = document.getElementById('btn-excluir-selecionados');
if (btnExcluirSelecionados) {
    btnExcluirSelecionados.addEventListener('click', async function() {
        const selecionados = Array.from(document.querySelectorAll('.selecionar-produto:checked'));
        if (selecionados.length === 0) {
            alert('Selecione pelo menos um produto para excluir.');
            return;
        }
        if (!confirm(`Deseja realmente excluir ${selecionados.length} produto(s)?`)) return;

        for (const cb of selecionados) {
            const id = cb.getAttribute('data-id');
            await fetch('http://localhost:8000/produtos/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
        }
        carregarProdutos();
    });
}

// Adicionar/remover variações dinamicamente
const btnAdicionarVariacao = document.getElementById('adicionar-variacao');
if (btnAdicionarVariacao) {
    btnAdicionarVariacao.addEventListener('click', function() {
        const container = document.getElementById('variacoes-container');
        if (!container) return;
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
}

// Evento de submit do formulário de cadastro de produto
const formCadastrarProduto = document.getElementById('form-cadastrar-produto');
if (formCadastrarProduto) {
    formCadastrarProduto.addEventListener('submit', async function(e) {
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
            formCadastrarProduto.reset();
            carregarProdutos();
            if (typeof carregarSelectProdutos === 'function') {
                carregarSelectProdutos();
            }
        } else {
            mensagemDiv.textContent = 'Erro ao cadastrar produto.';
            mensagemDiv.style.color = 'red';
        }
    });
}

// Só chama carregarProdutos se a tabela existir na página
if (document.getElementById('produtos-tbody')) {
    carregarProdutos();
}