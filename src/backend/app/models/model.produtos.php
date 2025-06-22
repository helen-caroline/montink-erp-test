<?php
$host = '127.0.0.1';
$db   = 'montink';
$user = 'root';
$pass = 'admin';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

function getAllProdutos() {
    global $user, $pass, $dsn;
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->query('SELECT * FROM produtos');
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($produtos as &$produto) {
            $stmtVar = $pdo->prepare('SELECT v.id, v.nome, v.valor FROM variacoes v WHERE v.produto_id = ?');
            $stmtVar->execute([$produto['id']]);
            $produto['variacoes'] = $stmtVar->fetchAll(PDO::FETCH_ASSOC);
        }

        return $produtos;
    } catch (PDOException $e) {
        return [];
    }
}

function insertProduto($nome, $preco, $estoque) {
    global $user, $pass, $dsn;
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $preco, $estoque]);
        return $pdo->lastInsertId();
    } catch (PDOException $e) {
        // Exiba o erro para debug
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

function insertProdutoComVariacoes($nome, $preco, $estoque, $cor, $modelo, $marca, $variacoes) {
    global $user, $pass, $dsn;
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Cria produto com todos os campos
        $stmt = $pdo->prepare('INSERT INTO produtos (nome, preco, estoque, cor, modelo, marca) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$nome, $preco, $estoque, $cor, $modelo, $marca]);
        $produto_id = $pdo->lastInsertId();

        foreach ($variacoes as $var) {
            $stmtVar = $pdo->prepare('INSERT INTO variacoes (produto_id, nome, valor) VALUES (?, ?, ?)');
            $stmtVar->execute([$produto_id, $var['nome'], $var['valor']]);
        }

        return $produto_id;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

function deleteProdutoById($id) {
    global $user, $pass, $dsn;
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Exclui estoque das variações do produto
        $stmt = $pdo->prepare('DELETE FROM estoque WHERE produto_id = ?');
        $stmt->execute([$id]);

        // Exclui variações do produto
        $stmt = $pdo->prepare('DELETE FROM variacoes WHERE produto_id = ?');
        $stmt->execute([$id]);

        // Exclui o produto
        $stmt = $pdo->prepare('DELETE FROM produtos WHERE id = ?');
        $stmt->execute([$id]);

        return true;
    } catch (PDOException $e) {
        return false;
    }
}