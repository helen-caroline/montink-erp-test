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

    if (!isset($data['nome']) || !isset($data['preco']) || !isset($data['estoque'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    $nome = $data['nome'];
    $preco = $data['preco'];
    $estoque = $data['estoque'];
    $cor = $data['cor'] ?? null;
    $modelo = $data['modelo'] ?? null;
    $marca = $data['marca'] ?? null;
    $variacoes = $data['variacoes'] ?? [];

    $id = insertProdutoComVariacoes($nome, $preco, $estoque, $cor, $modelo, $marca, $variacoes);
    if ($id) {
        echo json_encode(['success' => true, 'id' => $id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao inserir produto']);
    }
    exit;
}

function deleteProduto() {
    header('Access-Control-Allow-Origin: *');
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID não informado']);
        exit;
    }

    $ok = deleteProdutoById($data['id']);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao deletar produto']);
    }
    exit;
}