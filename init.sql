CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    preco DECIMAL(10,2),
    estoque INT,
    cor VARCHAR(100),
    modelo VARCHAR(100),
    marca VARCHAR(100)
);

CREATE TABLE variacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    nome VARCHAR(255),
    valor VARCHAR(255),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50),
    desconto DECIMAL(10,2),
    validade DATE,
    valor_minimo DECIMAL(10,2)
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    frete DECIMAL(10,2),
    total DECIMAL(10,2),
    status VARCHAR(50),
    endereco VARCHAR(255),
    cep VARCHAR(9),
    email VARCHAR(100),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE produto_cupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    cupom_id INT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (cupom_id) REFERENCES cupons(id)
);