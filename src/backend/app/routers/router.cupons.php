<?php

require_once __DIR__ . '/../controllers/controller.cupons.php';

function handleCuponsRoutes($uri, $method) {
    if ($uri === '/cupons/view' && $method === 'GET') {
        viewCupons();
    }
    if ($uri === '/cupons/delete' && $method === 'POST' || $method === 'DELETE') {
        deleteCupons();
    }
    if ($uri === '/cupons/create' && $method === 'POST') {
        createCupons();
    }
}