async function carregarCupons() {
    const resp = await fetch('http://localhost:8000/cupons/view');
    const data = await resp.json();
    const tbody = document.getElementById('cupons-tbody');
    tbody.innerHTML = '';

    if (data.cupons && data.cupons.length > 0) {
        data.cupons.forEach(cupom => {
            const validadeStr = cupom.validade ? cupom.validade : '<span style="color:#4fc3f7;font-weight:bold;">Vitalício</span>';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="selecionar-cupom" data-id="${cupom.id}">
                </td>
                <td>${cupom.id}</td>
                <td>${cupom.codigo}</td>
                <td>R$ ${parseFloat(cupom.desconto).toFixed(2)}</td>
                <td>${validadeStr}</td>
                <td>R$ ${parseFloat(cupom.valor_minimo).toFixed(2)}</td>
                <td></td> <!-- Removido o botão 🗑️ -->
            `;
            tbody.appendChild(tr);
        });

        // Seleção de todos
        const selecionarTodos = document.getElementById('selecionar-todos-cupons');
        if (selecionarTodos) {
            selecionarTodos.checked = false;
            selecionarTodos.onclick = function() {
                document.querySelectorAll('.selecionar-cupom').forEach(cb => {
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
        document.querySelectorAll('.selecionar-cupom').forEach(cb => {
            cb.addEventListener('change', function() {
                const all = document.querySelectorAll('.selecionar-cupom');
                const checked = document.querySelectorAll('.selecionar-cupom:checked');
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

        // Botão de deletar individual já existe
        document.querySelectorAll('.btn-deletar').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (confirm('Deseja realmente deletar este cupom?')) {
                    const resp = await fetch('http://localhost:8000/cupons/delete', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    if (resp.ok) {
                        carregarCupons();
                        carregarSelectCupons();
                    } else {
                        alert('Erro ao deletar cupom.');
                    }
                }
            });
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum cupom cadastrado.</td></tr>';
    }
}

const btnExcluirSelecionados = document.getElementById('btn-excluir-selecionados-cupons');
if (btnExcluirSelecionados) {
    btnExcluirSelecionados.addEventListener('click', async function() {
        const selecionados = Array.from(document.querySelectorAll('.selecionar-cupom:checked'));
        if (selecionados.length === 0) {
            alert('Selecione pelo menos um cupom para excluir.');
            return;
        }
        if (!confirm(`Deseja realmente excluir ${selecionados.length} cupom(ns)?`)) return;

        for (const cb of selecionados) {
            const id = cb.getAttribute('data-id');
            await fetch('http://localhost:8000/cupons/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
        }
        carregarCupons();
        carregarSelectCupons();
    });
}

const formCadastrarCupom = document.getElementById('form-cadastrar-cupom');
if (formCadastrarCupom) {
    formCadastrarCupom.addEventListener('submit', async function(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigo').value;
        const desconto = document.getElementById('desconto').value;
        const valor_minimo = document.getElementById('valor_minimo').value;
        const vitalicio = document.getElementById('vitalicio').checked;
        let validade = document.getElementById('validade').value;
        if (vitalicio) validade = null;

        const mensagemDiv = document.getElementById('mensagem-cadastro');

        const resp = await fetch('http://localhost:8000/cupons/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo,
                desconto,
                validade: validade === "" ? null : validade, // <-- Garante que o campo exista
                valor_minimo
            })
        });
        if (resp.ok) {
            mensagemDiv.textContent = 'Cupom cadastrado com sucesso!';
            mensagemDiv.style.color = 'green';
            formCadastrarCupom.reset();
            carregarCupons();
            carregarSelectCupons();
        } else {
            mensagemDiv.textContent = 'Erro ao cadastrar cupom.';
            mensagemDiv.style.color = 'red';
        }
    });

    // Desabilita o campo de data se vitalício estiver marcado
    const vitalicioCheckbox = document.getElementById('vitalicio');
    const validadeInput = document.getElementById('validade');
    if (vitalicioCheckbox && validadeInput) {
        vitalicioCheckbox.addEventListener('change', function() {
            validadeInput.disabled = this.checked;
            if (this.checked) validadeInput.value = '';
        });
    }
}

// Carregar cupons no select para vincular
async function carregarSelectCupons() {
    const resp = await fetch('http://localhost:8000/cupons/view');
    const data = await resp.json();
    const select = document.getElementById('select-cupom');
    select.innerHTML = '<option value="">Selecione um cupom</option>';
    if (data.cupons) {
        data.cupons.forEach(cupom => {
            const opt = document.createElement('option');
            opt.value = cupom.id;
            opt.textContent = `${cupom.codigo} (R$ ${parseFloat(cupom.desconto).toFixed(2)})`;
            select.appendChild(opt);
        });
    }
}

// Carregar produtos no select para vincular
async function carregarSelectProdutos() {
    const resp = await fetch('http://localhost:8000/produtos/view');
    const data = await resp.json();
    const select = document.getElementById('select-produto');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    if (data.produtos) {
        data.produtos.forEach(produto => {
            const opt = document.createElement('option');
            opt.value = produto.id;
            opt.textContent = `${produto.nome} (ID: ${produto.id})`;
            select.appendChild(opt);
        });
    }
}

// Evento de vincular cupom ao produto (ajuste endpoint conforme backend)
const formVincular = document.getElementById('form-vincular-cupom-produto');
if (formVincular) {
    formVincular.addEventListener('submit', async function(e) {
        e.preventDefault();
        const cupom_id = document.getElementById('select-cupom').value;
        const produto_id = document.getElementById('select-produto').value;
        const mensagemDiv = document.getElementById('mensagem-vinculo');

        // Ajuste o endpoint conforme sua implementação backend
        const resp = await fetch('http://localhost:8000/cupons/vincular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cupom_id, produto_id })
        });
        if (resp.ok) {
            mensagemDiv.textContent = 'Cupom vinculado ao produto!';
            mensagemDiv.style.color = 'green';
        } else {
            mensagemDiv.textContent = 'Erro ao vincular cupom.';
            mensagemDiv.style.color = 'red';
        }
    });
}

// Inicialização
carregarCupons();
carregarSelectCupons();
carregarSelectProdutos();