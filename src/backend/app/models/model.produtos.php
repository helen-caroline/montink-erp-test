<?php
require_once __DIR__ . '/../db.php';

function getAllProdutos() {
    $conn = getDbConnection();
    try {
        $stmt = $conn->query('SELECT * FROM produtos');
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($produtos as &$produto) {
            $stmtVar = $conn->prepare('SELECT v.id, v.nome, v.valor FROM variacoes v WHERE v.produto_id = ?');
            $stmtVar->execute([$produto['id']]);
            $produto['variacoes'] = $stmtVar->fetchAll(PDO::FETCH_ASSOC);
        
            // Buscar cupons vinculados
            $produto['cupons'] = getCuponsByProdutoId($produto['id']);
        }

        return $produtos;
    } catch (PDOException $e) {
        return [];
    }
}

function getCuponsByProdutoId($produto_id) {
    $conn = getDbConnection();
    $stmt = $conn->prepare('
        SELECT c.id, c.codigo, c.desconto, c.validade, c.valor_minimo
        FROM produto_cupons pc
        JOIN cupons c ON pc.cupom_id = c.id
        WHERE pc.produto_id = ?
    ');
    $stmt->execute([$produto_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertProduto($nome, $preco, $estoque) {
    $conn = getDbConnection();
    try {
        $stmt = $conn->prepare('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $preco, $estoque]);
        return $conn->lastInsertId();
    } catch (PDOException $e) {
        return false;
    }
}

function insertProdutoComVariacoes($nome, $preco, $estoque, $cor, $modelo, $marca, $variacoes) {
    $conn = getDbConnection();
    try {
        $stmt = $conn->prepare('INSERT INTO produtos (nome, preco, estoque, cor, modelo, marca) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$nome, $preco, $estoque, $cor, $modelo, $marca]);
        $produto_id = $conn->lastInsertId();

        foreach ($variacoes as $variacao) {
            $stmtVar = $conn->prepare('INSERT INTO variacoes (produto_id, nome, valor) VALUES (?, ?, ?)');
            $stmtVar->execute([$produto_id, $variacao['nome'], $variacao['valor']]);
        }
        return $produto_id;
    } catch (PDOException $e) {
        return false;
    }
}

function deleteProdutoById($id) {
    $conn = getDbConnection();
    try {
        $stmt = $conn->prepare('DELETE FROM produtos WHERE id = ?');
        $stmt->execute([$id]);

        // Exclui variações do produto
        $stmt = $conn->prepare('DELETE FROM variacoes WHERE produto_id = ?');
        $stmt->execute([$id]);

        // Exclui o produto
        $stmt = $conn->prepare('DELETE FROM produtos WHERE id = ?');
        $stmt->execute([$id]);

        return true;
    } catch (PDOException $e) {
        return false;
    }
}

function deleteVariacaoById($id) {
    $conn = getDbConnection();
    try {
        $stmt = $conn->prepare('DELETE FROM variacoes WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}