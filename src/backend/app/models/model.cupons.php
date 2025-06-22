<?php
header('Access-Control-Allow-Origin: *');

function getCupons($conn) {
    $stmt = $conn->query("SELECT * FROM cupons");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteCupom($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM cupons WHERE id = ?");
    return $stmt->execute([$id]);
}

function createCupom($conn, $codigo, $desconto, $validade, $valor_minimo) {
    $stmt = $conn->prepare("INSERT INTO cupons (codigo, desconto, validade, valor_minimo) VALUES (?, ?, ?, ?)");
    return $stmt->execute([$codigo, $desconto, $validade, $valor_minimo]);
}