USE db_voidclothing;
SET NAMES utf8mb4;

INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES
('Rafael Void', 'admin@voidclothing.com', '$2b$10$7UO5bYbAite3l/oGS9d.w.93lesUz957rGlNUpWDePx3xc724P3O2', '48999990001', 'admin'),
('Julia Costa', 'funcionario@voidclothing.com', '$2b$10$RG2w2KlxXybsYu3SR3kE7.8zqpY4yyRF1B9j9Lzmf5bVSsQc.ERfi', '48999990002', 'funcionario'),
('Lucas Almeida', 'lucas@email.com', '$2b$10$UQgRduRqqqATZnSE5SDC1uK3c5ZFgYE91U4dU.FVtZVJ/IA4ZPZZu', '48999990003', 'cliente'),
('Marina Silva', 'marina@email.com', '$2b$10$0eAI.QDAIBgyqyxzgKgM6uVeel/MB7pmsWNBmyPF3RPxfftXuL9FS', '48999990004', 'cliente'),
('Pedro Santos', 'pedro@email.com', '$2b$10$QiOo67avR6O5jSufcmbDze4hbUu11SpyFpjqCTSltMYfWQ/M3L1YS', '48999990005', 'cliente');

INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado, principal) VALUES
(3, '88010400', 'Rua Felipe Schmidt', '120', 'Apto 302', 'Centro', 'Florianópolis', 'SC', TRUE),
(3, '88036000', 'Rua Lauro Linhares', '800', NULL, 'Trindade', 'Florianópolis', 'SC', FALSE),
(4, '01310100', 'Avenida Paulista', '1500', 'Sala 12', 'Bela Vista', 'São Paulo', 'SP', TRUE),
(5, '80010000', 'Rua XV de Novembro', '300', NULL, 'Centro', 'Curitiba', 'PR', TRUE);

INSERT INTO categorias (nome, descricao) VALUES
('Camisetas', 'Camisetas oversized, boxy e básicas'),
('Moletons', 'Hoodies e crewnecks'),
('Calças', 'Cargos, joggers e modelagens amplas'),
('Bonés e Gorros', 'Acessórios de cabeça'),
('Acessórios', 'Ecobags e complementos');

INSERT INTO colecoes (nome, descricao, ativa) VALUES
('Essentials', 'Peças base da marca em preto, branco e cinza', TRUE),
('Night Shift', 'Coleção de inverno com foco em moletons e calças', TRUE),
('Void Club', 'Acessórios e itens de edição limitada', TRUE);

INSERT INTO produtos (nome, descricao, preco, preco_promocional, imagem_url, categoria_id, colecao_id, ativo) VALUES
('Camiseta Oversized Void Preta', 'Camiseta oversized em algodão 100%, gola reforçada e estampa minimalista nas costas.', 149.90, NULL, '/assets/img/produtos/camiseta-oversized-preta.jpg', 1, 1, TRUE),
('Camiseta Boxy Logo Branca', 'Camiseta boxy de corte reto com logo Void bordado no peito.', 129.90, NULL, '/assets/img/produtos/camiseta-boxy-branca.jpg', 1, 1, TRUE),
('Moletom Hoodie Void Preto', 'Hoodie pesado em moletom flanelado, capuz duplo e bolso canguru.', 279.90, 249.90, '/assets/img/produtos/hoodie-preto.jpg', 2, 1, TRUE),
('Moletom Crewneck Cinza', 'Crewneck cinza mescla com modelagem ampla e punhos canelados.', 239.90, NULL, '/assets/img/produtos/crewneck-cinza.jpg', 2, 2, TRUE),
('Calça Cargo Preta', 'Calça cargo em sarja com bolsos laterais e barra ajustável.', 259.90, NULL, '/assets/img/produtos/cargo-preta.jpg', 3, 2, TRUE),
('Calça Jogger Cinza', 'Jogger em moletom leve com cós elástico e cordão.', 199.90, 179.90, '/assets/img/produtos/jogger-cinza.jpg', 3, 2, TRUE),
('Boné Dad Hat Preto', 'Boné aba curva com ajuste traseiro e logo bordado.', 99.90, NULL, '/assets/img/produtos/bone-preto.jpg', 4, 3, TRUE),
('Gorro Beanie Void Cinza', 'Gorro em tricô canelado com etiqueta Void.', 79.90, NULL, '/assets/img/produtos/beanie-cinza.jpg', 4, 3, TRUE),
('Ecobag Void Preta', 'Ecobag em lona resistente com estampa em serigrafia.', 59.90, NULL, '/assets/img/produtos/ecobag-preta.jpg', 5, 3, TRUE);

INSERT INTO produto_variacoes (produto_id, tamanho, cor, estoque) VALUES
(1, 'P', 'Preto', 10),
(1, 'M', 'Preto', 15),
(1, 'G', 'Preto', 12),
(1, 'GG', 'Preto', 6),
(2, 'P', 'Branco', 8),
(2, 'M', 'Branco', 10),
(2, 'G', 'Branco', 7),
(3, 'P', 'Preto', 3),
(3, 'M', 'Preto', 5),
(3, 'G', 'Preto', 8),
(3, 'GG', 'Preto', 4),
(4, 'M', 'Cinza', 6),
(4, 'G', 'Cinza', 9),
(4, 'GG', 'Cinza', 5),
(5, '38', 'Preto', 4),
(5, '40', 'Preto', 7),
(5, '42', 'Preto', 6),
(5, '44', 'Preto', 3),
(6, '38', 'Cinza', 5),
(6, '40', 'Cinza', 6),
(6, '42', 'Cinza', 4),
(7, 'Único', 'Preto', 20),
(8, 'Único', 'Cinza', 18),
(9, 'Único', 'Preto', 30);

INSERT INTO carrinho_itens (usuario_id, variacao_id, quantidade) VALUES
(3, 3, 1),
(3, 20, 1),
(5, 12, 2);

INSERT INTO pedidos (cliente_id, endereco_id, subtotal, frete, total, status, codigo_rastreio, criado_em) VALUES
(3, 1, 549.70, 19.90, 569.60, 'entregue', 'VD100000001BR', '2026-10-05 14:20:00'),
(4, 3, 389.80, 24.90, 414.70, 'enviado', 'VD100000002BR', '2026-11-02 10:45:00'),
(5, 4, 219.70, 29.90, 249.60, 'aguardando_pagamento', NULL, '2026-11-08 16:10:00'),
(4, 3, 239.90, 24.90, 264.80, 'cancelado', NULL, '2026-10-20 09:30:00');

INSERT INTO pedido_itens (pedido_id, variacao_id, quantidade, preco_unitario) VALUES
(1, 2, 2, 149.90),
(1, 9, 1, 249.90),
(2, 6, 1, 129.90),
(2, 16, 1, 259.90),
(3, 22, 1, 99.90),
(3, 24, 2, 59.90),
(4, 13, 1, 239.90);

INSERT INTO pagamentos (pedido_id, metodo, status, valor, pago_em, criado_em) VALUES
(1, 'pix', 'aprovado', 569.60, '2026-10-05 14:22:00', '2026-10-05 14:20:00'),
(2, 'cartao_credito', 'aprovado', 414.70, '2026-11-02 10:46:00', '2026-11-02 10:45:00'),
(3, 'pix', 'pendente', 249.60, NULL, '2026-11-08 16:10:00'),
(4, 'cartao_credito', 'recusado', 264.80, NULL, '2026-10-20 09:30:00');