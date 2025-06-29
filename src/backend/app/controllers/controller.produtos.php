<?php
// controller.produtos.php

require_once __DIR__ . '/../models/model.produtos.php';

function viewProdutos() {
    header('Access-Control-Allow-Origin: *');
    // Se a rota for /produtos/view-todos, mostra todos
    $uri = $_SERVER['REQUEST_URI'];
    if (strpos($uri, '/produtos/view-todos') === 0) {
        $produtos = getAllProdutosComEstoqueZero();
    } else {
        $produtos = getAllProdutos(true);
    }
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

function deleteVariacao() {
    header('Access-Control-Allow-Origin: *');
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID da variação não informado']);
        exit;
    }

    $ok = deleteVariacaoById($data['id']);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao deletar variação']);
    }
    exit;
}

function desvincularCupomProduto() {
    header('Access-Control-Allow-Origin: *');
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['cupom_id']) || !isset($data['produto_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados incompletos']);
        exit;
    }

    $ok = desvincularCupomDoProduto($data['produto_id'], $data['cupom_id']);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao desvincular cupom']);
    }
    exit;
}

function updateProduto($id) {
    header('Access-Control-Allow-Origin: *');
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!$dados) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    $ok = updateProdutoById($id, $dados);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar produto']);
    }
    exit;
}