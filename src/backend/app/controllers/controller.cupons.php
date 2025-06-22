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