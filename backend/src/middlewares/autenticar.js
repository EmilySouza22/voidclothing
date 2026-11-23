const jwt = require('jsonwebtoken');

// Confere se veio um token válido. Se sim, deixa o usuário em req.usuario.
module.exports = function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token)
    return res.status(401).json({ erro: 'Faça login para continuar.' });

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: dados.id, perfil: dados.perfil };
    next();
  } catch {
    return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
  }
};