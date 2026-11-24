const db = require('../config/db');

// GET /api/clientes/me/resumo
// REGRA 7 (cliente nunca vê dados de outro cliente): o id vem do TOKEN
// (req.usuario.id), NUNCA da URL nem do body. Por isso não dá para pedir o de outra pessoa.
async function resumo(req, res) {
  try {
    const clienteId = req.usuario.id;

    // Últimos 20 pedidos, com a foto do primeiro produto de cada um.
    // (LIMIT fica escrito direto: o mysql2 reclama de "LIMIT ?" em consulta preparada)
    const [pedidos] = await db.execute(
      `SELECT p.id, p.total, p.status, p.criado_em,
              (SELECT pr.imagem_url
                 FROM pedido_itens pi
                 JOIN produto_variacoes v ON v.id = pi.variacao_id
                 JOIN produtos pr ON pr.id = v.produto_id
                WHERE pi.pedido_id = p.id
                ORDER BY pi.id
                LIMIT 1) AS imagem_url
         FROM pedidos p
        WHERE p.cliente_id = ?
        ORDER BY p.criado_em DESC
        LIMIT 20`,
      [clienteId]
    );

    const [[qtdPedidos]] = await db.execute(
      'SELECT COUNT(*) AS total FROM pedidos WHERE cliente_id = ?',
      [clienteId]
    );
    const [[qtdEnderecos]] = await db.execute(
      'SELECT COUNT(*) AS total FROM enderecos WHERE usuario_id = ?',
      [clienteId]
    );

    return res.json({
      totalPedidos: qtdPedidos.total,
      totalEnderecos: qtdEnderecos.total,
      pedidos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
}

module.exports = { resumo };