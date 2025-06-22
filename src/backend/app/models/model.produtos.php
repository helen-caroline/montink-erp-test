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
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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