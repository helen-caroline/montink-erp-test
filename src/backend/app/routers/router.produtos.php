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
    if ($uri === '/produtos/cupom/desvincular' && ($method === 'DELETE' || $method === 'POST')) {
        desvincularCupomProduto();
        return;
    }

    // Rotas : UPDATE
    if (preg_match('#^/produtos/update/(\d+)$#', $uri, $matches) && $method === 'PUT' || $method === 'PATH' || $method === 'POST') {
        updateProduto((int)$matches[1]);
        return;
    }
}