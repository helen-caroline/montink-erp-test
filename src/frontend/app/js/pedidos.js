document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.querySelector('#tabela-pedidos tbody');
    const modalBg = document.getElementById('modal-bg');
    const fecharModal = document.getElementById('fechar-modal');
    const detalhesPedido = document.getElementById('detalhes-pedido');

    // Buscar pedidos
    fetch('http://localhost:8000/pedidos/view')
        .then(res => res.json())
        .then(data => {
            if (data.pedidos && Array.isArray(data.pedidos)) {
                data.pedidos.forEach(pedido => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${pedido.id}</td>
                        <td>${pedido.email}</td>
                        <td>${pedido.status}</td>
                        <td>R$ ${Number(pedido.total).toFixed(2)}</td>
                        <td>${new Date(pedido.criado_em).toLocaleString('pt-BR')}</td>
                    `;
                    tr.addEventListener('click', () => mostrarDetalhes(pedido));
                    tabela.appendChild(tr);
                });
            }
        });

    function mostrarDetalhes(pedido) {
        detalhesPedido.innerHTML = `
            <strong>ID:</strong> ${pedido.id}<br>
            <strong>Status:</strong> ${pedido.status}<br>
            <strong>Cliente:</strong> ${pedido.email}<br>
            <strong>Endereço:</strong> ${pedido.endereco} - CEP: ${pedido.cep}<br>
            <strong>Frete:</strong> R$ ${Number(pedido.frete).toFixed(2)}<br>
            <strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2)}<br>
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
                        ${(pedido.produtos || []).map(prod => `
                            <tr>
                                <td>${prod.nome || '-'}</td>
                                <td>${prod.quantidade}</td>
                                <td>R$ ${Number(prod.preco).toFixed(2)}</td>
                                <td>${prod.cor || '-'}</td>
                                <td>${prod.modelo || '-'}</td>
                                <td>${prod.marca || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        modalBg.style.display = 'flex';
    }

    fecharModal.onclick = () => modalBg.style.display = 'none';
    modalBg.onclick = e => { if (e.target === modalBg) modalBg.style.display = 'none'; };
});