const API = 'http://localhost:8000';

let produtos = [];
let carrinho = [];

function renderCatalogo() {
    const cat = document.getElementById('catalogo-produtos');
    cat.innerHTML = '';
    produtos.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <div class="produto-info">
                <span class="produto-nome">${prod.nome}</span>
                <span class="produto-preco">R$ ${Number(prod.preco).toFixed(2)}${prod.marca ? ' - ' + prod.marca : ''}</span>
            </div>
            <div class="produto-controles">
                <input type="number" min="1" value="1" id="qtd_${prod.id}">
                <button onclick="adicionarCarrinho(${prod.id})">Adicionar</button>
            </div>
        `;
        cat.appendChild(div);
    });
}

function renderCarrinho() {
    const car = document.getElementById('carrinho');
    if (carrinho.length === 0) {
        car.innerHTML = '<i>Carrinho vazio</i>';
        document.getElementById('btn-finalizar').disabled = true;
        return;
    }
    let total = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0);
    car.innerHTML = `
        <div class="carrinho-lista">
            ${carrinho.map(item => `
                <span>${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}
                <button onclick="removerCarrinho(${item.produto_id})" style="background:#e74c3c;color:#fff;padding:2px 8px;font-size:0.9em;">x</button>
                </span>
            `).join('<br>')}
        </div>
        <div><b>Frete:</b> R$ 50,00</div>
        <div><b>Total:</b> R$ ${(total + 50).toFixed(2)}</div>
    `;
    document.getElementById('btn-finalizar').disabled = false;
}

window.adicionarCarrinho = function(produto_id) {
    const prod = produtos.find(p => p.id === produto_id);
    const qtd = parseInt(document.getElementById('qtd_' + produto_id).value, 10);
    if (!prod || qtd < 1) return;
    const idx = carrinho.findIndex(i => i.produto_id === produto_id);
    if (idx >= 0) {
        carrinho[idx].quantidade += qtd;
    } else {
        carrinho.push({
            produto_id: prod.id,
            nome: prod.nome,
            preco: prod.preco,
            quantidade: qtd,
            marca: prod.marca
        });
    }
    renderCarrinho();
};

window.removerCarrinho = function(produto_id) {
    carrinho = carrinho.filter(i => i.produto_id !== produto_id);
    renderCarrinho();
};

async function carregarProdutos() {
    // Supondo endpoint GET /produtos/view
    const res = await fetch(API + '/produtos/view');
    const data = await res.json();
    produtos = data.produtos || [];
    renderCatalogo();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    renderCarrinho();

    // Modal
    const modalBg = document.getElementById('modal-bg');
    const fecharModal = document.getElementById('fechar-modal');
    const formPedido = document.getElementById('form-pedido');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const mensagem = document.getElementById('mensagem');

    btnFinalizar.onclick = () => {
        if (carrinho.length === 0) {
            alert('Adicione produtos ao carrinho!');
            return;
        }
        modalBg.style.display = 'flex';
    };

    // Botão ERP
    const btnErp = document.getElementById('btn-erp');
    if (btnErp) {
        btnErp.onclick = () => {
            window.location.href = '../public/index.html';
        };
    }

    fecharModal.onclick = () => modalBg.style.display = 'none';
    modalBg.onclick = e => { if (e.target === modalBg) modalBg.style.display = 'none'; };

    formPedido.onsubmit = async function(e) {
        e.preventDefault();
        if (carrinho.length === 0) {
            alert('Adicione produtos ao carrinho!');
            return;
        }
        const form = e.target;
        const pedido = {
            frete: 50,
            total: carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0) + 50,
            status: 'Pendente',
            endereco: form.endereco.value,
            cep: form.cep.value,
            email: form.email.value,
            produtos: carrinho.map(item => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade
            }))
        };
        const resp = await fetch(API + '/pedidos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        if (resp.ok) {
            mensagem.innerText = 'Pedido realizado com sucesso!';
            carrinho = [];
            renderCarrinho();
            form.reset();
            modalBg.style.display = 'none';
        } else {
            const erro = await resp.text();
            mensagem.innerText = 'Erro: ' + erro;
        }
    };
});