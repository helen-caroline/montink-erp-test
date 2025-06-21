<?php
// controller.produtos.php

require_once __DIR__ . '/../models/model.produtos.php';

function viewProdutos() {
    $produtos = getAllProdutos();
    header('Content-Type: application/json');
    echo json_encode(['produtos' => $produtos]);
    exit;
}