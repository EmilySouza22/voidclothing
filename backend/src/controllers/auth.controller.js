const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function gerarToken(usuario) {
  // O perfil vai DENTRO do token: o back-end decide a permissão, não o front.
  return jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/cadastro
async function cadastrar(req, res) {
  try {
    const { nome, email, senha, telefone, aceitouTermos } = req.body;

    // VALIDAÇÃO NA ENTRADA: o back nunca confia no que o front mandou.
    if (!nome || nome.trim().length < 3 || nome.trim().length > 100)
      return res.status(400).json({ erro: 'Informe o nome completo.' });

    if (!email || !EMAIL_REGEX.test(email) || email.length > 150)
      return res.status(400).json({ erro: 'E-mail inválido.' });

    // bcrypt só considera os primeiros 72 caracteres, por isso o limite.
    if (!senha || senha.length < 8 || senha.length > 72)
      return res.status(400).json({ erro: 'A senha precisa ter entre 8 e 72 caracteres.' });

    // REGRA LGPD: sem consentimento não cria conta, e registramos QUANDO foi dado.
    if (aceitouTermos !== true)
      return res.status(400).json({ erro: 'É preciso aceitar os Termos de Uso e a Política de Privacidade.' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const emailLimpo = email.trim().toLowerCase();

    // Consulta parametrizada (?) = proteção contra SQL injection.
    // REGRA: perfil FIXO 'cliente'. Nunca aceitar perfil vindo do body.
    const [resultado] = await db.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil, consentimento_em)
       VALUES (?, ?, ?, ?, 'cliente', NOW())`,
      [nome.trim(), emailLimpo, senhaHash, telefone || null]
    );

    const usuario = { id: resultado.insertId, perfil: 'cliente' };
    return res.status(201).json({
      token: gerarToken(usuario),
      usuario: { id: usuario.id, nome: nome.trim(), email: emailLimpo, perfil: 'cliente' },
    });
  } catch (err) {
    // O UNIQUE do e-mail no banco é a garantia final contra duplicidade.
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    console.error(err);
    return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });

    const [linhas] = await db.execute(
      'SELECT id, nome, email, senha_hash, perfil, ativo FROM usuarios WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    const usuario = linhas[0];

    // Mesma mensagem para "e-mail não existe" e "senha errada":
    // assim ninguém descobre quais e-mails estão cadastrados.
    const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senha_hash));
    if (!senhaOk)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    if (!usuario.ativo)
      return res.status(403).json({ erro: 'Conta desativada. Fale com a loja.' });

    return res.json({
      token: gerarToken(usuario),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
}

// GET /api/auth/me  (o front usa para saber quem está logado)
async function me(req, res) {
  try {
    const [linhas] = await db.execute(
      'SELECT id, nome, email, telefone, perfil FROM usuarios WHERE id = ? AND ativo = TRUE',
      [req.usuario.id]
    );
    if (!linhas[0]) return res.status(401).json({ erro: 'Sessão inválida.' });
    return res.json(linhas[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro no servidor. Tente novamente.' });
  }
}

module.exports = { cadastrar, login, me };