<?php
require_once __DIR__ . '/../models/model.pedidos.php'; // Adicione esta linha

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

function viewAllPedidos() {
    $conn = getDbConnection();
    $pedidos = getAllPedidos($conn);
    header('Content-Type: application/json');
    echo json_encode(['pedidos' => $pedidos]);
    exit;
}

function viewPedidoById($id) {
    $conn = getDbConnection();
    $pedido = getPedidoById($conn, $id);
    if ($pedido) {
        header('Content-Type: application/json');
        echo json_encode(['pedido' => $pedido]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Pedido not found']);
    }
    exit;
}

function createPedido() {
    $conn = getDbConnection();
    $pedido = json_decode(file_get_contents('php://input'), true);

    // Validação básica dos campos do pedido
    if (!$pedido || !isset($pedido['frete'], $pedido['total'], $pedido['status'], $pedido['endereco'], $pedido['cep'], $pedido['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Campos obrigatórios do pedido faltando']);
        exit;
    }

    // Validação dos produtos
    if (!isset($pedido['produtos']) || !is_array($pedido['produtos']) || count($pedido['produtos']) == 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Produtos não enviados ou formato inválido']);
        exit;
    }

    // Validação de cada produto no array
    foreach ($pedido['produtos'] as $produto) {
        if (!isset($produto['produto_id']) || !isset($produto['quantidade']) || !is_numeric($produto['quantidade']) || $produto['quantidade'] <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Produto com dados inválidos']);
            exit;
        }
    }

    try {
        $id = postPedido($conn, $pedido);
        header('Content-Type: application/json');
        echo json_encode(['id' => $id]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;

    // Chama a função que insere o pedido e os produtos
    $id = postPedido($conn, $pedido);

    header('Content-Type: application/json');
    echo json_encode(['id' => $id]);
    exit;
}

function updatePedido($id) {
    $conn = getDbConnection();
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!$dados) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    $ok = updatePedidoById($conn, $id, $dados);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar pedido']);
    }
    exit;
}

function updateProdutoDoPedido($pedido_id, $produto_id) {
    $conn = getDbConnection();
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!$dados || !isset($dados['quantidade'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Campo quantidade obrigatório']);
        exit;
    }

    $ok = model_updateProdutoDoPedido($conn, $pedido_id, $produto_id, ['quantidade' => $dados['quantidade']]);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Erro ao atualizar quantidade do produto no pedido']);
    }
    exit;
}

function deletePedido($id) {
    $conn = getDbConnection();
    // Remove produtos do pedido primeiro
    $stmt = $conn->prepare('DELETE FROM pedidos_produtos WHERE pedido_id = ?');
    $stmt->execute([$id]);
    // Remove o pedido
    $stmt = $conn->prepare('DELETE FROM pedidos WHERE id = ?');
    $ok = $stmt->execute([$id]);
    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao deletar pedido']);
    }
    exit;
}