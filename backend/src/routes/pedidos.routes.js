const { Router } = require('express');
const autenticar = require('../middlewares/autenticar');
const { detalhe } = require('../controllers/pedidoDetalhe.controller');

const router = Router();

// GET /api/pedidos/:id  (detalhes de um pedido)
router.get('/:id', autenticar, detalhe);

module.exports = router;