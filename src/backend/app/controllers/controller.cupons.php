<?php
header('Access-Control-Allow-Origin: *');

function viewCupons() {
    $conn = getDbConnection();
    $cupons = getCupons($conn);
    header('Content-Type: application/json');
    echo json_encode($cupons);
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
    if (!isset($data['codigo'], $data['desconto'], $data['validade'], $data['valor_minimo'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados incompletos']);
        exit;
    }
    $success = createCupom($conn, $data['codigo'], $data['desconto'], $data['validade'], $data['valor_minimo']);
    echo json_encode(['success' => $success]);
    exit;
}