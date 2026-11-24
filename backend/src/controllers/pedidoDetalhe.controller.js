const db = require('../config/db');

// GET /api/pedidos/:id
// REGRA (cliente nunca vê dados de outro cliente): o cliente só enxerga pedido
// dele mesmo (cliente_id vem do TOKEN). Pedido de outra pessoa responde 404,
// igual a um pedido que não existe, para não revelar quais ids existem.
async function detalhe(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0)
            return res.status(400).json({ erro: 'Pedido inválido.' });

        const ehEquipe = ['admin', 'funcionario'].includes(req.usuario.perfil);

        // SELECT * de propósito: pega o que existir de frete, desconto, pagamento, datas...
        // sem quebrar caso alguma dessas colunas ainda não exista na tabela.
        const [[p]] = await db.execute(
            ehEquipe
                ? 'SELECT * FROM pedidos WHERE id = ?'
                : 'SELECT * FROM pedidos WHERE id = ? AND cliente_id = ?',
            ehEquipe ? [id] : [id, req.usuario.id]
        );
        if (!p) return res.status(404).json({ erro: 'Pedido não encontrado.' });

        // ATENÇÃO: assume produto_variacoes.tamanho e pedido_itens.quantidade / preco_unitario.
        const [linhasItens] = await db.execute(
            `SELECT pi.*, pr.nome, pr.imagem_url, v.tamanho
         FROM pedido_itens pi
         JOIN produto_variacoes v ON v.id = pi.variacao_id
         JOIN produtos pr ON pr.id = v.produto_id
        WHERE pi.pedido_id = ?
        ORDER BY pi.id`,
            [id]
        );

        const itens = linhasItens.map((i) => ({
            id: i.id,
            nome: i.nome,
            imagem_url: i.imagem_url,
            tamanho: i.tamanho,
            quantidade: Number(i.quantidade ?? i.qtd ?? 1),
            preco: Number(i.preco_unitario ?? i.preco ?? 0),
        }));

        const somaItens = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);

        // Endereço (se o pedido guarda o endereco_id). Filtra pelo dono do pedido.
        let endereco = null;
        if (p.endereco_id) {
            const [[e]] = await db.execute(
                'SELECT * FROM enderecos WHERE id = ? AND usuario_id = ?',
                [p.endereco_id, p.cliente_id]
            );
            endereco = e || null;
        }

        return res.json({
            id: p.id,
            status: p.status,
            criado_em: p.criado_em,
            itens,
            subtotal: Number(p.subtotal ?? somaItens),
            frete: Number(p.frete ?? p.valor_frete ?? 0),
            desconto: Number(p.desconto ?? 0),
            total: Number(p.total),
            endereco,
            pagamento: {
                forma: p.forma_pagamento ?? p.metodo_pagamento ?? null,
                final: p.cartao_final ?? null,
            },
            // Datas de cada etapa, se o banco guardar (senão ficam null e o front esconde)
            datas: {
                pago: p.pago_em ?? null,
                em_separacao: p.separado_em ?? null,
                enviado: p.enviado_em ?? null,
                entregue: p.entregue_em ?? null,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
    }
}

module.exports = { detalhe }; 