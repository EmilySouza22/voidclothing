const express = require('express');
const autenticar = require('../middlewares/autenticar');
const { resumo } = require('../controllers/clientes.controller');

const router = express.Router();

router.get('/me/resumo', autenticar, resumo);

module.exports = router;