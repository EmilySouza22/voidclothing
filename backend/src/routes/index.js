const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', api: 'ok', banco: 'ok' });
  } catch (erro) {
    console.error('Falha ao conectar no banco:', erro.message);
    res.status(503).json({ status: 'erro', api: 'ok', banco: 'falha' });
  }
});

router.use('/auth', require('./auth.routes'));
router.use('/produtos', require('./produtos.routes'));
router.use('/categorias', require('./categorias.routes'));
router.use('/carrinho', require('./carrinho.routes'));
router.use('/pedidos', require('./pedidos.routes'));
router.use('/pagamentos', require('./pagamentos.routes'));
router.use('/clientes', require('./clientes.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
