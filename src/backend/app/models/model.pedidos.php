<?php
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db.php';

function getAllPedidos($conn) {
    $stmt = $conn->query("SELECT * FROM pedidos");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getPedidoById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM pedidos WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function postPedido($conn, $pedido) {
    $stmt = $conn->prepare("INSERT INTO pedidos (frete, total, status, endereco, cep, email) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $pedido['frete'],
        $pedido['total'],
        $pedido['status'],
        $pedido['endereco'],
        $pedido['cep'],
        $pedido['email']
    ]);
    return $conn->lastInsertId();
}