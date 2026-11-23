DROP DATABASE IF EXISTS db_voidclothing;
CREATE DATABASE db_voidclothing CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE db_voidclothing;

CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,
  perfil ENUM('cliente', 'funcionario', 'admin') NOT NULL DEFAULT 'cliente',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email)
);

CREATE TABLE enderecos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  cep CHAR(8) NOT NULL,
  logradouro VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  complemento VARCHAR(80) NULL,
  bairro VARCHAR(80) NOT NULL,
  cidade VARCHAR(80) NOT NULL,
  estado CHAR(2) NOT NULL,
  principal BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  CONSTRAINT fk_enderecos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(60) NOT NULL,
  descricao VARCHAR(255) NULL,
  PRIMARY KEY (id),
  CONSTRAINT uq_categorias_nome UNIQUE (nome)
);

CREATE TABLE colecoes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(60) NOT NULL,
  descricao VARCHAR(255) NULL,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  CONSTRAINT uq_colecoes_nome UNIQUE (nome)
);

CREATE TABLE produtos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2) NULL,
  imagem_url VARCHAR(255) NULL,
  categoria_id INT UNSIGNED NOT NULL,
  colecao_id INT UNSIGNED NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
  CONSTRAINT chk_produtos_promo CHECK (preco_promocional IS NULL OR (preco_promocional >= 0 AND preco_promocional <= preco)),
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id),
  CONSTRAINT fk_produtos_colecao FOREIGN KEY (colecao_id) REFERENCES colecoes (id)
);

CREATE TABLE produto_variacoes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  produto_id INT UNSIGNED NOT NULL,
  tamanho VARCHAR(10) NOT NULL,
  cor VARCHAR(30) NOT NULL,
  estoque INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT uq_variacao UNIQUE (produto_id, tamanho, cor),
  CONSTRAINT fk_variacoes_produto FOREIGN KEY (produto_id) REFERENCES produtos (id)
);

CREATE TABLE carrinho_itens (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  variacao_id INT UNSIGNED NOT NULL,
  quantidade INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT uq_carrinho UNIQUE (usuario_id, variacao_id),
  CONSTRAINT chk_carrinho_qtd CHECK (quantidade > 0),
  CONSTRAINT fk_carrinho_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_carrinho_variacao FOREIGN KEY (variacao_id) REFERENCES produto_variacoes (id) ON DELETE CASCADE
);

CREATE TABLE pedidos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_id INT UNSIGNED NOT NULL,
  endereco_id INT UNSIGNED NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  frete DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('aguardando_pagamento', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado') NOT NULL DEFAULT 'aguardando_pagamento',
  codigo_rastreio VARCHAR(30) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_pedidos_status (status),
  CONSTRAINT chk_pedidos_valores CHECK (subtotal >= 0 AND frete >= 0 AND total >= 0),
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios (id),
  CONSTRAINT fk_pedidos_endereco FOREIGN KEY (endereco_id) REFERENCES enderecos (id)
);

CREATE TABLE pedido_itens (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  variacao_id INT UNSIGNED NOT NULL,
  quantidade INT UNSIGNED NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT chk_itens_qtd CHECK (quantidade > 0),
  CONSTRAINT chk_itens_preco CHECK (preco_unitario >= 0),
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
  CONSTRAINT fk_itens_variacao FOREIGN KEY (variacao_id) REFERENCES produto_variacoes (id)
);

CREATE TABLE pagamentos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  metodo ENUM('pix', 'cartao_credito', 'cartao_debito', 'boleto') NOT NULL,
  status ENUM('pendente', 'aprovado', 'recusado', 'estornado') NOT NULL DEFAULT 'pendente',
  valor DECIMAL(10,2) NOT NULL,
  pago_em DATETIME NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_pagamentos_pedido UNIQUE (pedido_id),
  CONSTRAINT chk_pagamentos_valor CHECK (valor >= 0),
  CONSTRAINT fk_pagamentos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
);