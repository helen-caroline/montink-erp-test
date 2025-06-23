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
    
    if (!$pedido || !isset($pedido['frete'], $pedido['total'], $pedido['status'], $pedido['endereco'], $pedido['cep'], $pedido['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }
    
    $id = postPedido($conn, $pedido);
    header('Content-Type: application/json');
    echo json_encode(['id' => $id]);
    exit;
}