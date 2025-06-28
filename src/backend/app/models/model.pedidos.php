<?php
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db.php';

function getAllPedidos($conn) {
    $sql = "
        SELECT 
            p.id AS pedido_id,
            p.frete,
            p.total,
            p.status,
            p.endereco,
            p.cep,
            p.email,
            p.criado_em,
            pp.produto_id,
            pp.quantidade,
            pr.nome,
            pr.preco,
            pr.estoque,
            pr.cor,
            pr.modelo,
            pr.marca
        FROM pedidos p
        LEFT JOIN pedidos_produtos pp ON p.id = pp.pedido_id
        LEFT JOIN produtos pr ON pp.produto_id = pr.id
        ORDER BY p.id
    ";

    $stmt = $conn->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $pedidos = [];

    foreach ($rows as $row) {
        $pedidoId = $row['pedido_id'];

        // Se ainda não adicionamos esse pedido ao array
        if (!isset($pedidos[$pedidoId])) {
            $pedidos[$pedidoId] = [
                "id" => $pedidoId,
                "frete" => $row['frete'],
                "total" => $row['total'],
                "status" => $row['status'],
                "endereco" => $row['endereco'],
                "cep" => $row['cep'],
                "email" => $row['email'],
                "criado_em" => $row['criado_em'],
                "produtos" => []
            ];
        }

        // Se tem produto vinculado, adiciona no array de produtos
        if ($row['produto_id']) {
            $pedidos[$pedidoId]['produtos'][] = [
                "produto_id" => $row['produto_id'],
                "quantidade" => $row['quantidade'],
                "nome" => $row['nome'],
                "preco" => $row['preco'],
                "estoque" => $row['estoque'],
                "cor" => $row['cor'],
                "modelo" => $row['modelo'],
                "marca" => $row['marca']
            ];
        }
    }

    // Transforma o array de pedidos para um array numérico no final
    return array_values($pedidos);
}

function getPedidoById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM pedidos WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function postPedido($conn, $pedido) {
    $descontoCupom = 0;
    if (!empty($pedido['cupom_codigo'])) {
        // Busca cupom
        $stmt = $conn->prepare("SELECT * FROM cupons WHERE codigo = ?");
        $stmt->execute([$pedido['cupom_codigo']]);
        $cupom = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cupom) {
            // Validação de validade e valor mínimo
            $hoje = date('Y-m-d');
            if ($cupom['validade'] && $cupom['validade'] < $hoje) {
                throw new Exception('Cupom expirado');
            }
            if ($pedido['total'] < $cupom['valor_minimo']) {
                throw new Exception('Valor mínimo para o cupom não atingido');
            }

            // NOVO: Verifica se o cupom está vinculado a pelo menos um produto do pedido
            $produtoIds = array_map(function($p) { return $p['produto_id']; }, $pedido['produtos']);
            $in = implode(',', array_fill(0, count($produtoIds), '?'));
            $sql = "SELECT 1 FROM produto_cupons WHERE cupom_id = ? AND produto_id IN ($in) LIMIT 1";
            $params = array_merge([$cupom['id']], $produtoIds);
            $stmtVinculo = $conn->prepare($sql);
            $stmtVinculo->execute($params);
            if (!$stmtVinculo->fetch()) {
                throw new Exception('Cupom não está vinculado a nenhum produto do pedido');
            }

            $descontoCupom = floatval($cupom['desconto']);
        } else {
            throw new Exception('Cupom não encontrado');
        }
    }

    // Aplica desconto
    $totalComDesconto = $pedido['total'];
    if ($totalComDesconto < 0) $totalComDesconto = 0;

    // Inserir o pedido
    $stmt = $conn->prepare("INSERT INTO pedidos (frete, total, status, endereco, cep, email, cupom_codigo) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $pedido['frete'],
        $totalComDesconto,
        $pedido['status'],
        $pedido['endereco'],
        $pedido['cep'],
        $pedido['email'],
        $pedido['cupom_codigo'] ?? null
]);
    $pedidoId = $conn->lastInsertId();

    // Verificar se vieram produtos e baixar estoque
    if (isset($pedido['produtos']) && is_array($pedido['produtos'])) {
        foreach ($pedido['produtos'] as $produto) {
            $produtoId = $produto['produto_id'];
            $quantidade = isset($produto['quantidade']) ? $produto['quantidade'] : 1;

            // Baixar estoque
            $stmtEstoque = $conn->prepare("SELECT estoque FROM produtos WHERE id = ?");
            $stmtEstoque->execute([$produtoId]);
            $estoqueAtual = $stmtEstoque->fetchColumn();
            if ($estoqueAtual === false || $estoqueAtual < $quantidade) {
                throw new Exception("Estoque insuficiente para o produto ID $produtoId");
            }
            $stmtBaixa = $conn->prepare("UPDATE produtos SET estoque = estoque - ? WHERE id = ?");
            $stmtBaixa->execute([$quantidade, $produtoId]);

            postVincularPedidoProduto($conn, $pedidoId, $produtoId, $quantidade);
        }
    }

    return $pedidoId;
}

function postVincularPedidoProduto($conn, $pedidoId, $produtoId, $quantidade) {
    $stmt = $conn->prepare("INSERT INTO pedidos_produtos (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)");
    $stmt->execute([$pedidoId, $produtoId, $quantidade]);
    return $stmt->rowCount() > 0;
}

function updatePedidoById($conn, $id, $dados) {
    $campos = [];
    $valores = [];

    foreach (['frete','total','status','endereco','cep','email'] as $campo) {
        if (isset($dados[$campo])) {
            $campos[] = "$campo = ?";
            $valores[] = $dados[$campo];
        }
    }
    if (empty($campos)) return false;

    $valores[] = $id;
    $sql = "UPDATE pedidos SET " . implode(', ', $campos) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    return $stmt->execute($valores);
}

function model_updateProdutoDoPedido($conn, $pedido_id, $produto_id, $dados) {
    // Atualiza apenas a quantidade na tabela pedidos_produtos
    if (isset($dados['quantidade'])) {
        $stmt = $conn->prepare("UPDATE pedidos_produtos SET quantidade = ? WHERE pedido_id = ? AND produto_id = ?");
        $stmt->execute([$dados['quantidade'], $pedido_id, $produto_id]);
        return $stmt->rowCount() > 0;
    }
    return false;
}