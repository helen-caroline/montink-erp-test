<?php

require_once __DIR__ . '/../controllers/controller.produtos.php';

function handleProdutosRoutes($uri, $method) {
    // Suporte a CORS para preflight (OPTIONS)
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

    // Rotas : GET
    if ($uri === '/produtos/view' && $method === 'GET') {
        viewProdutos();
        return;
    }
    
    // Rotas : POST
    if ($uri === '/produtos/create' && $method === 'POST') {
        createProduto();
        return;
    }

    // Rotas : DELETE
    if ($uri === '/produtos/delete' && ($method === 'DELETE' || $method === 'POST')) {
        deleteProduto();
        return;
    }
    if ($uri === '/produtos/variacao/delete' && ($method === 'DELETE' || $method === 'POST')) {
        deleteVariacao();
        return;
    }
}