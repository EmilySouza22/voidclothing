require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

(async () => {
  const [usuarios] = await db.execute('SELECT email, senha_hash FROM usuarios');
  for (const u of usuarios) {
    console.log(u.email, '->', bcrypt.compareSync('Senha@123', u.senha_hash));
  }
  process.exit();
})();