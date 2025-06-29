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

let descontoCupom = 0;
let cupomAplicado = null;

function renderCarrinho() {
    // Se o cupom aplicado não é mais válido para o carrinho atual, remove
    if (cupomAplicado) {
        let vinculado = false;
        for (const item of carrinho) {
            const prod = produtos.find(p => p.id === item.produto_id);
            if (prod && prod.cupons && prod.cupons.some(c => c.codigo.toLowerCase() === cupomAplicado.codigo.toLowerCase())) {
                vinculado = true;
                break;
            }
        }
        if (!vinculado) {
            cupomAplicado = null;
            descontoCupom = 0;
            const mensagemCupom = document.getElementById('mensagem-cupom');
            if (mensagemCupom) mensagemCupom.textContent = '';
        }
    }
    const car = document.getElementById('carrinho');
    if (carrinho.length === 0) {
        car.innerHTML = '<i>Carrinho vazio</i>';
        document.getElementById('btn-finalizar').disabled = true;
        return;
    }
    let total = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0) + 50;
    let totalFinal = total - descontoCupom;
    if (totalFinal < 0) totalFinal = 0;

    car.innerHTML = `
        <div class="carrinho-lista">
            ${carrinho.map(item => `
                <span>${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}
                <button onclick="removerCarrinho(${item.produto_id})" style="background:#e74c3c;color:#fff;padding:2px 8px;font-size:0.9em;">x</button>
                </span>
            `).join('<br>')}
        </div>
        <div><b>Frete:</b> R$ 50,00</div>
        ${cupomAplicado ? `<div style="color:#4fc3f7;"><b>Cupom aplicado:</b> ${cupomAplicado.codigo} (-R$ ${descontoCupom.toFixed(2)})</div>` : ''}
        <div><b>Total:</b> R$ ${totalFinal.toFixed(2)}</div>
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

    if (!formPedido.querySelector('input[name="cupom_codigo"]')) {
        const labelCupom = document.createElement('label');
        labelCupom.innerHTML = 'Cupom: <input type="text" name="cupom_codigo" placeholder="Código do cupom">';
        formPedido.insertBefore(labelCupom, formPedido.querySelector('button[type="submit"]'));
    }

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

    const inputCupom = document.getElementById('input-cupom');
    const btnAplicarCupom = document.getElementById('btn-aplicar-cupom');
    const mensagemCupom = document.getElementById('mensagem-cupom');

    btnAplicarCupom.onclick = async function() {
        const codigo = inputCupom.value.trim();
        mensagemCupom.style.color = '#e74c3c';
        mensagemCupom.textContent = '';
        descontoCupom = 0;
        cupomAplicado = null;
    
        if (!codigo) {
            mensagemCupom.textContent = 'Digite um código de cupom.';
            renderCarrinho();
            return;
        }
    
        // Busca cupons no backend
        const resp = await fetch(API + '/cupons/view');
        const data = await resp.json();
        const cupom = (data.cupons || []).find(c => c.codigo.toLowerCase() === codigo.toLowerCase());
    
        if (!cupom) {
            mensagemCupom.textContent = 'Cupom não encontrado.';
            renderCarrinho();
            return;
        }
    
        // NOVO: Verifica se o cupom está vinculado a pelo menos um produto do carrinho
        let vinculado = false;
        for (const item of carrinho) {
            // Busca cupons vinculados ao produto
            const prod = produtos.find(p => p.id === item.produto_id);
            if (prod && prod.cupons && prod.cupons.some(c => c.codigo.toLowerCase() === codigo.toLowerCase())) {
                vinculado = true;
                break;
            }
        }
        if (!vinculado) {
            mensagemCupom.textContent = 'Cupom não está vinculado a nenhum produto do carrinho.';
            renderCarrinho();
            return;
        }

        // Validação de validade e valor mínimo
        const hoje = new Date().toISOString().slice(0, 10);
        if (cupom.validade && cupom.validade < hoje) {
            mensagemCupom.textContent = 'Cupom expirado.';
            renderCarrinho();
            return;
        }
        let total = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0) + 50;
        if (total < parseFloat(cupom.valor_minimo)) {
            mensagemCupom.textContent = `Valor mínimo para usar este cupom: R$ ${parseFloat(cupom.valor_minimo).toFixed(2)}`;
            renderCarrinho();
            return;
        }

        descontoCupom = Math.abs(parseFloat(cupom.desconto));
        cupomAplicado = cupom;
        mensagemCupom.style.color = '#4fc3f7';
        mensagemCupom.textContent = `Cupom aplicado: ${cupom.codigo} (-R$ ${descontoCupom.toFixed(2)})`;
        renderCarrinho();
    };

    formPedido.onsubmit = async function(e) {
        e.preventDefault();
        if (carrinho.length === 0) {
            alert('Adicione produtos ao carrinho!');
            return;
        }
        const form = e.target;
        let total = carrinho.reduce((s, item) => s + item.preco * item.quantidade, 0) + 50;
        let totalFinal = total - descontoCupom;
        if (totalFinal < 0) totalFinal = 0;
    
        const pedido = {
            frete: 50,
            total: totalFinal,
            status: 'Pendente',
            endereco: form.endereco.value,
            cep: form.cep.value,
            email: form.email.value,
            cupom_codigo: cupomAplicado ? cupomAplicado.codigo : '',
            produtos: carrinho.map(item => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade
            }))
        };

        if (form.cupom_codigo && form.cupom_codigo.value.trim() !== '') {
            pedido.cupom_codigo = form.cupom_codigo.value.trim();
        }
    
        const resp = await fetch(API + '/pedidos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        if (resp.ok) {
            mensagem.innerText = 'Pedido realizado com sucesso!';
            carrinho = [];
            cupomAplicado = null;         // <-- Limpa o cupom aplicado
            descontoCupom = 0;            // <-- Limpa o desconto do cupom
            renderCarrinho();
            form.reset();
            modalBg.style.display = 'none';
        } else {
            const erro = await resp.json().catch(() => ({}));
            mensagem.innerText = 'Erro: ' + (erro.error || 'Erro ao criar pedido');
            // Se for erro de cupom, também mostra no campo do cupom
            if (erro.error && erro.error.toLowerCase().includes('cupom')) {
                mensagemCupom.textContent = erro.error;
                mensagemCupom.style.color = '#e74c3c';
            }
        }
    };
});