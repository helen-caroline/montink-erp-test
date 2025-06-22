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
    
    if ($uri === '/produtos/create' && $method === 'POST') {
        createProduto();
        return;
    }
}