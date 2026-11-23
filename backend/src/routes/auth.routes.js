const express = require('express');
const { cadastrar, login, me } = require('../controllers/auth.controller');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

router.post('/cadastro', cadastrar);
router.post('/login', login);
router.get('/me', autenticar, me);

module.exports = router;