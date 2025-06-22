<?php
require_once __DIR__ . '/../models/model.cupons.php'; // Adicione esta linha

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

function viewCupons() {
    $conn = getDbConnection();
    $cupons = getCupons($conn);
    header('Content-Type: application/json');
    echo json_encode(['cupons' => $cupons]);
    exit;
}

function deleteCupons() {
    $conn = getDbConnection();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID do cupom não informado']);
        exit;
    }
    $success = deleteCupom($conn, $data['id']);
    echo json_encode(['success' => $success]);
    exit;
}

function createCupons() {
    $conn = getDbConnection();
    $data = json_decode(file_get_contents('php://input'), true);

    // Validação robusta
    if (
        !isset($data['codigo'], $data['desconto'], $data['valor_minimo']) ||
        !array_key_exists('validade', $data)
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados incompletos']);
        exit;
    }

    // Conversão de tipos
    $codigo = $data['codigo'];
    $desconto = floatval($data['desconto']);
    $valor_minimo = floatval($data['valor_minimo']);
    $validade = $data['validade'] ?: null;

    $success = createCupom($conn, $codigo, $desconto, $validade, $valor_minimo);
    echo json_encode(['success' => $success]);
    exit;
}

function vincularCupomProduto() {
    $conn = getDbConnection();
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['cupom_id'], $data['produto_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados incompletos']);
        exit;
    }
    // Evita duplicidade
    $stmt = $conn->prepare('SELECT 1 FROM produto_cupons WHERE produto_id = ? AND cupom_id = ?');
    $stmt->execute([$data['produto_id'], $data['cupom_id']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => true, 'message' => 'Já vinculado']);
        exit;
    }
    $stmt = $conn->prepare('INSERT INTO produto_cupons (produto_id, cupom_id) VALUES (?, ?)');
    $ok = $stmt->execute([$data['produto_id'], $data['cupom_id']]);
    echo json_encode(['success' => $ok]);
    exit;
}