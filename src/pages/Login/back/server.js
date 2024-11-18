require('dotenv').config({ path: '../../../../.env' });
const express = require('express');




const app = express();
const auth = require('./auth'); // Arquivo de autenticação
const cors = require('cors'); // Caso esteja fazendo requisição de domínios diferentes

app.use(cors()); // Caso precise para evitar problemas com CORS
app.use(express.json()); // Necessário para o express entender o corpo da requisição

app.post('/login', auth); // Rota de login

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
