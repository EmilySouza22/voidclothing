// Uso: exigirPerfil('admin') ou exigirPerfil('funcionario', 'admin')
// REGRAS 7 e 8 começam aqui: sem o perfil certo, o back-end bloqueia e avisa.
module.exports = function exigirPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil))
      return res.status(403).json({ erro: 'Você não tem permissão para isso.' });
    next();
  };
};