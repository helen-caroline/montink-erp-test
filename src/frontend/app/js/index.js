function showPage(page, event) {
    if (event) event.preventDefault();
    // Menu ativo
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    if (event) event.target.classList.add('active');
    // Conteúdo
    document.getElementById('home').style.display = (page === 'home') ? 'block' : 'none';
    document.getElementById('produtos').style.display = (page === 'produtos') ? 'block' : 'none';
    document.getElementById('estoque').style.display = (page === 'estoque') ? 'block' : 'none';
    document.getElementById('cupons').style.display = (page === 'cupons') ? 'block' : 'none';
}

// Inicialização para garantir que a Home apareça ao carregar
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
});