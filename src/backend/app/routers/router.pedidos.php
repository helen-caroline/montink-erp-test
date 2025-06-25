<?php

require_once __DIR__ . '/../controllers/controller.pedidos.php';

function handlePedidosRoutes($uri, $method) {
    // Suporte a CORS para preflight (OPTIONS)
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        http_response_code(204);
        exit;
    }
    
    if ($uri === '/pedidos/view' && $method === 'GET') {
        viewAllPedidos();
        exit;
    }

    if ($uri === '/pedidos/create' && $method === 'POST') {
        createPedido();
        exit;
    }

    if (
        preg_match('#^/pedidos/update/(\d+)$#', $uri, $matches)
        && (
            $method === 'PATCH'
            || $method === 'PUT'
            || $method === 'POST'
        )
    ) {
        updatePedido((int)$matches[1]);
        exit;
    }

    if (
        preg_match('#^/pedidos/produto/update/(\d+)/(\d+)$#', $uri, $matches)
        && (
            $method === 'PATCH'
            || $method === 'PUT'
            || $method === 'POST'
        )
    ) {
        updateProdutoDoPedido((int)$matches[1], (int)$matches[2]);
        exit;
    }

}