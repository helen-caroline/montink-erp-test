<?php
// controller.produtos.php

require_once __DIR__ . '/../models/model.produtos.php';

function viewProdutos() {
    header('Access-Control-Allow-Origin: *'); // <-- Adicione esta linha
    $produtos = getAllProdutos();
    header('Content-Type: application/json');
    echo json_encode(['produtos' => $produtos]);
    exit;
}

function createProduto() {
    header('Access-Control-Allow-Origin: *');
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['nome']) || !isset($data['preco'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    $variacoes = $data['variacoes'] ?? [];

    $id = insertProdutoComVariacoes($data['nome'], $data['preco'], $variacoes);
    if ($id) {
        echo json_encode(['success' => true, 'id' => $id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao inserir produto']);
    }
    exit;
}