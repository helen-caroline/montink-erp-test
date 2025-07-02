<?php
header('Access-Control-Allow-Origin: *');

function getCupons($conn) {
    $stmt = $conn->query("SELECT * FROM cupons");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteCupom($conn, $id) {
    // Remove vínculos primeiro
    $stmt = $conn->prepare('DELETE FROM produto_cupons WHERE cupom_id = ?');
    $stmt->execute([$id]);

    // Agora deleta o cupom
    $stmt = $conn->prepare('DELETE FROM cupons WHERE id = ?');
    return $stmt->execute([$id]);
}

function createCupom($conn, $codigo, $desconto, $validade, $valor_minimo) {
    $stmt = $conn->prepare("INSERT INTO cupons (codigo, desconto, validade, valor_minimo, ativo) VALUES (?, ?, ?, ?, 1)");
    return $stmt->execute([$codigo, $desconto, $validade, $valor_minimo]);
}

function toggleCupomStatus($conn, $id) {
    $stmt = $conn->prepare("UPDATE cupons SET ativo = NOT ativo WHERE id = ?");
    return $stmt->execute([$id]);
}

function updateCupomStatus($conn, $id, $ativo) {
    $stmt = $conn->prepare("UPDATE cupons SET ativo = ? WHERE id = ?");
    return $stmt->execute([$ativo, $id]);
}