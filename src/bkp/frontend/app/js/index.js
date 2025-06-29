function showPage(page, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.painel, .iframe-container').forEach(div => div.style.display = 'none');
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    if (event) event.target.classList.add('active');
    document.getElementById(page).style.display = 'block';

    // Recarrega o iframe de cupons ao abrir a aba Cupons
    if (page === 'cupons') {
        const iframe = document.querySelector('#cupons iframe');
        iframe.src = iframe.src;
    }

    // Recarrega o iframe de estoque ao abrir a aba Estoque
    if (page === 'estoque') {
        const iframe = document.querySelector('#estoque iframe');
        iframe.src = iframe.src;
    }
}

function recarregarPedidosIframe() {
    const iframe = document.querySelector('#pedidos iframe');
    if (iframe) {
        iframe.contentWindow.location.reload();
    }
}

// Inicialização para garantir que a Home apareça ao carregar
document.addEventListener('DOMContentLoaded', function() {
    showPage('home'); 
});