<?php
// app.php

require_once __DIR__ . '/routers/router.produtos.php';
require_once __DIR__ . '/routers/router.cupons.php';
require_once __DIR__ . '/routers/router.pedidos.php';

function handleRequest() {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];

    // Rotas de produtos
    if (strpos($uri, '/produtos') === 0) {
        handleProdutosRoutes($uri, $method);
        return;
    }

    // Rotas de pedidos
    if (strpos($uri, '/pedidos') === 0) {
        handlePedidosRoutes($uri, $method);
        return;
    }

    // Rotas de cupons
    if (strpos($uri, '/cupons') === 0) {
        handleCuponsRoutes($uri, $method);
        return;
    }

    // helfth check
    if ($uri === '/hello' && $method === 'GET') {
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Hello World']);
        exit;
    }

    // 404 para outras rotas
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}