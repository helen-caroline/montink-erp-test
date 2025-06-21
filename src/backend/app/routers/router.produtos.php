<?php
// router.produtos.php

require_once __DIR__ . '/../controllers/controller.produtos.php';

function handleProdutosRoutes($uri, $method) {
    if ($uri === '/produtos' && $method === 'GET') {
        header('Content-Type: application/json');
        echo json_encode(['health' => 'funcionando']);
        exit;
    }

    if ($uri === '/produtos/view' && $method === 'GET') {
        viewProdutos();
        return;
    }
    // Adicione outras rotas de produtos aqui
}