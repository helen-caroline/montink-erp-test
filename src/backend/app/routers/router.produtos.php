<?php

require_once __DIR__ . '/../controllers/controller.produtos.php';

function handleProdutosRoutes($uri, $method) {
    // Suporte a CORS para preflight (OPTIONS)
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        http_response_code(204);
        exit;
    }

    if ($uri === '/produtos' && $method === 'GET') {
        header('Access-Control-Allow-Origin: *');
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