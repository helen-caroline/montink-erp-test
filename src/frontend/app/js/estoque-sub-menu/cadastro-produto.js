// Alternância do sub-menu de Produtos
document.addEventListener('DOMContentLoaded', function() {
    const btnLista = document.getElementById('aba-lista');
    const btnCadastro = document.getElementById('aba-cadastro');
    const conteudoLista = document.getElementById('conteudo-lista');
    const conteudoCadastro = document.getElementById('conteudo-cadastro');

    if (btnLista && btnCadastro && conteudoLista && conteudoCadastro) {
        btnLista.onclick = function() {
            btnLista.classList.add('active');
            btnCadastro.classList.remove('active');
            conteudoLista.style.display = '';
            conteudoCadastro.style.display = 'none';
        };
        btnCadastro.onclick = function() {
            btnCadastro.classList.add('active');
            btnLista.classList.remove('active');
            conteudoCadastro.style.display = '';
            conteudoLista.style.display = 'none';
        };
    }
});