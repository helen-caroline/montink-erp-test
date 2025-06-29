document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.querySelector('#tabela-pedidos tbody');
    const modalBg = document.getElementById('modal-bg');
    const fecharModal = document.getElementById('fechar-modal');
    const detalhesPedido = document.getElementById('detalhes-pedido');
    const selecionarTodos = document.getElementById('selecionar-todos-pedidos');
    const btnExcluirSelecionados = document.getElementById('btn-excluir-selecionados-pedidos');

    // Buscar pedidos
    fetch('http://localhost:8000/pedidos/view')
        .then(res => res.json())
        .then(data => {
            if (data.pedidos && Array.isArray(data.pedidos)) {
                data.pedidos.forEach(pedido => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <input type="checkbox" class="selecionar-pedido" data-id="${pedido.id}">
                        </td>
                        <td>${pedido.id}</td>
                        <td>${pedido.email}</td>
                        <td>${pedido.status}</td>
                        <td>R$ ${Number(pedido.total).toFixed(2)}</td>
                        <td>${new Date(pedido.criado_em).toLocaleString('pt-BR')}</td>
                        <td>
                            <span class="editar-pedido" title="Editar produtos" style="cursor:pointer;color:#4fc3f7;font-size:1.3rem;" data-id="${pedido.id}">&#9998;</span>
                        </td>
                    `;
                    tr.addEventListener('click', (e) => {
                        // Evita abrir detalhes ao clicar nos ícones ou checkbox
                        if (
                            !e.target.classList.contains('editar-pedido') &&
                            !e.target.classList.contains('selecionar-pedido')
                        ) {
                            mostrarDetalhes(pedido, false);
                        }
                    });
                    tr.querySelector('.editar-pedido').addEventListener('click', (e) => {
                        e.stopPropagation();
                        mostrarDetalhes(pedido, true);
                    });
                    tabela.appendChild(tr);
                });

                // Seleção de todos
                if (selecionarTodos) {
                    selecionarTodos.checked = false;
                    selecionarTodos.onclick = function() {
                        document.querySelectorAll('.selecionar-pedido').forEach(cb => {
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
                document.querySelectorAll('.selecionar-pedido').forEach(cb => {
                    cb.addEventListener('change', function() {
                        const all = document.querySelectorAll('.selecionar-pedido');
                        const checked = document.querySelectorAll('.selecionar-pedido:checked');
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
            }
        });

    // Exclusão em massa
    if (btnExcluirSelecionados) {
        btnExcluirSelecionados.addEventListener('click', async function() {
            const selecionados = Array.from(document.querySelectorAll('.selecionar-pedido:checked'));
            if (selecionados.length === 0) {
                alert('Selecione pelo menos um pedido para excluir.');
                return;
            }
            if (!confirm(`Deseja realmente excluir ${selecionados.length} pedido(s)?`)) return;

            for (const cb of selecionados) {
                const id = cb.getAttribute('data-id');
                await fetch(`http://localhost:8000/pedidos/delete/${id}`, {
                    method: 'DELETE'
                });
            }
            window.location.reload();
        });
    }

    function mostrarDetalhes(pedido, modoEdicao = false) {
        detalhesPedido.innerHTML = `
            <form id="form-editar-pedido">
                <strong>ID:</strong> ${pedido.id}<br>
                <strong>Status:</strong> ${modoEdicao ? `
                    <select name="status" style="width:120px;">
                        <option value="Pendente" ${pedido.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="Pago" ${pedido.status === 'Pago' ? 'selected' : ''}>Pago</option>
                        <option value="Enviado" ${pedido.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="Cancelado" ${pedido.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                ` : pedido.status}<br>
                <strong>Cliente:</strong> ${pedido.email}<br>
                <strong>Endereço:</strong> ${modoEdicao ? `<input type="text" name="endereco" value="${pedido.endereco}" style="width:220px;">` : pedido.endereco}<br>
                <strong>CEP:</strong> ${modoEdicao ? `<input type="text" name="cep" value="${pedido.cep}" style="width:220px;">` : pedido.cep}<br>
                <strong>Frete:</strong> ${pedido.frete}<br>
                <strong>Total:</strong> ${pedido.total}<br>
                <strong>Data:</strong> ${new Date(pedido.criado_em).toLocaleString('pt-BR')}<br>
                <div class="produtos-lista">
                    <h3>Produtos do Pedido</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Cor</th>
                                <th>Modelo</th>
                                <th>Marca</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(pedido.produtos || []).map((prod, idx) => `
                                <tr>
                                    <td>${prod.nome || '-'}</td>
                                    <td>
                                        ${modoEdicao ? `<input type="number" min="1" name="quantidade_${prod.produto_id}" value="${prod.quantidade}" style="width:60px;">` : prod.quantidade}
                                    </td>
                                    <td>
                                        R$ ${Number(prod.preco).toFixed(2)}
                                    </td>
                                    <td>
                                        ${prod.cor || '-'}
                                    </td>
                                    <td>
                                        ${prod.modelo || '-'}
                                    </td>
                                    <td>
                                        ${prod.marca || '-'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ${modoEdicao ? `<button type="submit" style="margin-top:16px;background:#4fc3f7;color:#232e43;padding:8px 18px;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Salvar</button>` : ''}
            </form>
        `;
        modalBg.style.display = 'flex';
    
        if (modoEdicao) {
            document.getElementById('form-editar-pedido').onsubmit = async function(e) {
                e.preventDefault();
                const form = e.target;
    
                // Atualiza dados do pedido
                try {
                    const pedidoUpdate = {
                        status: form.status.value,
                        endereco: form.endereco.value,
                        cep: form.cep.value,
                        frete: pedido.frete,
                        total: pedido.total
                    };
                    const respPedido = await fetch(`http://localhost:8000/pedidos/update/${pedido.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(pedidoUpdate)
                    });
                    if (!respPedido.ok) {
                        const msg = await respPedido.text();
                        throw new Error(`Erro ao atualizar pedido: ${msg}`);
                    }
                } catch (err) {
                    alert(err.message);
                    return;
                }
    
                // Atualiza quantidade dos produtos
                for (const prod of (pedido.produtos || [])) {
                    const novaQtd = form[`quantidade_${prod.produto_id}`].value;
                    if (novaQtd != prod.quantidade) {
                        try {
                            const resp = await fetch(`http://localhost:8000/pedidos/produto/update/${pedido.id}/${prod.produto_id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ quantidade: novaQtd })
                            });
                            if (!resp.ok) {
                                const msg = await resp.text();
                                throw new Error(`Erro ao atualizar produto: ${msg}`);
                            }
                        } catch (err) {
                            alert(err.message);
                            return;
                        }
                    }
                }
                alert('Pedido atualizado com sucesso!');
                modalBg.style.display = 'none';
                window.location.reload();
            };
        }
    }

    fecharModal.onclick = () => modalBg.style.display = 'none';
    modalBg.onclick = e => { if (e.target === modalBg) modalBg.style.display = 'none'; };
});