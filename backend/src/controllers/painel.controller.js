const db = require('../config/db');

// Pedidos que contam como venda: nem os que ainda aguardam pagamento, nem os cancelados.
const STATUS_FORA_DAS_VENDAS = "('aguardando_pagamento', 'cancelado')";

// Abaixo (ou igual) a esse número, o produto entra em "Estoque em baixa".
const LIMITE_ESTOQUE_BAIXO = 5;

const PERIODOS_VALIDOS = [7, 30, 90];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Variação percentual entre o período atual e o anterior.
// Sem base de comparação (anterior = 0) devolve null, e o front não mostra a seta.
function variacao(atual, anterior) {
    if (!anterior) return null;
    return Math.round(((atual - anterior) / anterior) * 1000) / 10;
}

// "YYYY-MM-DD" no horário local (mesmo formato que o DATE_FORMAT do MySQL devolve)
function chaveDia(data) {
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${m}-${d}`;
}

// GET /api/admin/painel?dias=7|30|90
async function painel(req, res) {
    try {
        // WHITELIST: só aceita 7, 30 ou 90. Qualquer outra coisa cai no padrão (30).
        // Por isso o número pode ir direto no SQL (INTERVAL) sem risco de injection.
        const pedido = Number(req.query.dias);
        const dias = PERIODOS_VALIDOS.includes(pedido) ? pedido : 30;

        // ---- 1) Vendas e pedidos: período atual x período anterior (mesma duração) ----
        const [[pedidosAgg]] = await db.execute(
            `SELECT
         COALESCE(SUM(CASE WHEN criado_em >= DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN total END), 0) AS vendas_atual,
         COUNT(CASE WHEN criado_em >= DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN 1 END)               AS pedidos_atual,
         COALESCE(SUM(CASE WHEN criado_em <  DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN total END), 0) AS vendas_anterior,
         COUNT(CASE WHEN criado_em <  DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN 1 END)               AS pedidos_anterior
       FROM pedidos
      WHERE status NOT IN ${STATUS_FORA_DAS_VENDAS}
        AND criado_em >= DATE_SUB(NOW(), INTERVAL ${dias * 2} DAY)`
        );

        const vendasAtual = Number(pedidosAgg.vendas_atual);
        const vendasAnterior = Number(pedidosAgg.vendas_anterior);
        const pedidosAtual = Number(pedidosAgg.pedidos_atual);
        const pedidosAnterior = Number(pedidosAgg.pedidos_anterior);

        const ticketAtual = pedidosAtual ? vendasAtual / pedidosAtual : 0;
        const ticketAnterior = pedidosAnterior ? vendasAnterior / pedidosAnterior : 0;

        // ---- 2) Novos clientes (cadastros no período) ----
        // ATENÇÃO: assume a coluna usuarios.criado_em. Se o nome for outro, ajuste aqui.
        const [[clientesAgg]] = await db.execute(
            `SELECT
         COUNT(CASE WHEN criado_em >= DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN 1 END) AS atual,
         COUNT(CASE WHEN criado_em <  DATE_SUB(NOW(), INTERVAL ${dias} DAY) THEN 1 END) AS anterior
       FROM usuarios
      WHERE perfil = 'cliente'
        AND criado_em >= DATE_SUB(NOW(), INTERVAL ${dias * 2} DAY)`
        );

        // ---- 3) Vendas por dia nos últimos 7 dias (gráfico; não depende do filtro) ----
        const [linhasSemana] = await db.execute(
            `SELECT DATE_FORMAT(criado_em, '%Y-%m-%d') AS dia, SUM(total) AS total
         FROM pedidos
        WHERE status NOT IN ${STATUS_FORA_DAS_VENDAS}
          AND criado_em >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY dia`
        );
        const totalPorDia = new Map(linhasSemana.map((l) => [l.dia, Number(l.total)]));

        // Monta os 7 dias, inclusive os sem venda (total 0), para a linha do gráfico não ter buracos.
        const vendasSemana = [];
        for (let i = 6; i >= 0; i--) {
            const data = new Date();
            data.setDate(data.getDate() - i);
            vendasSemana.push({
                dia: DIAS_SEMANA[data.getDay()],
                total: totalPorDia.get(chaveDia(data)) || 0,
            });
        }

        // ---- 4) Pedidos recentes (4 últimos, com foto do primeiro item) ----
        const [pedidosRecentes] = await db.execute(
            `SELECT p.id, p.status, p.criado_em,
              (SELECT pr.imagem_url
                 FROM pedido_itens pi
                 JOIN produto_variacoes v ON v.id = pi.variacao_id
                 JOIN produtos pr ON pr.id = v.produto_id
                WHERE pi.pedido_id = p.id
                ORDER BY pi.id
                LIMIT 1) AS imagem_url
         FROM pedidos p
        ORDER BY p.criado_em DESC
        LIMIT 4`
        );

        // ---- 5) Estoque em baixa (os 5 mais críticos) ----
        // ATENÇÃO: assume produto_variacoes.estoque e produto_variacoes.tamanho.
        const [estoqueBaixo] = await db.execute(
            `SELECT v.id, pr.nome, v.tamanho, v.estoque, pr.imagem_url
         FROM produto_variacoes v
         JOIN produtos pr ON pr.id = v.produto_id
        WHERE v.estoque <= ?
        ORDER BY v.estoque ASC, pr.nome ASC
        LIMIT 5`,
            [LIMITE_ESTOQUE_BAIXO]
        );

        return res.json({
            totalVendas: vendasAtual,
            variacaoVendas: variacao(vendasAtual, vendasAnterior),
            pedidosRealizados: pedidosAtual,
            variacaoPedidos: variacao(pedidosAtual, pedidosAnterior),
            novosClientes: Number(clientesAgg.atual),
            variacaoClientes: variacao(Number(clientesAgg.atual), Number(clientesAgg.anterior)),
            ticketMedio: Math.round(ticketAtual * 100) / 100,
            variacaoTicket: variacao(ticketAtual, ticketAnterior),
            vendasSemana,
            pedidosRecentes,
            estoqueBaixo,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
    }
}

module.exports = { painel };