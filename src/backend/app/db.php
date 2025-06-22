<?php

function getDbConnection() {
    $host = '127.0.0.1';
    $db   = 'montink';
    $user = 'root';
    $pass = 'admin';
    $charset = 'utf8mb4';
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()]);
        exit;
    }
}