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
}