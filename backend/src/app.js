const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
