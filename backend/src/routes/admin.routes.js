const express = require('express');
const autenticar = require('../middlewares/autenticar');
const { painel } = require('../controllers/painel.controller');

const router = express.Router();

// Só admin e funcionário entram (o perfil vem dentro do token)
function somenteEquipe(req, res, next) {
    if (!['admin', 'funcionario'].includes(req.usuario?.perfil))
        return res.status(403).json({ erro: 'Acesso negado.' });
    next();
}

router.get('/painel', autenticar, somenteEquipe, painel);

module.exports = router;