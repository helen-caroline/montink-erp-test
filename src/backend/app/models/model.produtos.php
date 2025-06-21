<?php
// model.produtos.php

function getAllProdutos() {
    $host = 'localhost';
    $db   = 'montink'; // Altere para o nome do seu banco
    $user = 'root';       // Altere para seu usuário
    $pass = 'admin';         // Altere para sua senha
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    try {
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->query('SELECT * FROM produtos');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }
}