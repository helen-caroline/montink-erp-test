<?php

require_once __DIR__ . '/../controllers/controller.cupons.php';

function handleCuponsRoutes($uri, $method) {
    // Suporte a CORS para preflight (OPTIONS)
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        http_response_code(204);
        exit;
    }
    
    // Adicionar cabeçalhos CORS para todas as requisições
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    
    if ($uri === '/cupons/view' && $method === 'GET') {
        viewCupons();
        exit;
    }
    if ($uri === '/cupons/delete' && ($method === 'POST' || $method === 'DELETE')) {
        deleteCupons();
        exit;
    }
    if ($uri === '/cupons/create' && $method === 'POST') {
        createCupons();
        exit;
    }
    if ($uri === '/cupons/vincular' && $method === 'POST') {
        vincularCupomProduto();
        exit;
    }
    if ($uri === '/cupons/toggle-status' && ($method === 'POST' || $method === 'PUT' || $method === 'PATCH')) {
        toggleCupomStatusController();
        exit;
    }
}