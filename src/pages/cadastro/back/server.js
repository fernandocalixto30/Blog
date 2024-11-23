// Importa os módulos necessários para a aplicação
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


// Cria uma instância do Express
const app = express();

// Configura o CORS
app.use(cors());

// Configura o Express para parsear requisições JSON
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'F30122006fd#',
  database: 'blog'
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Rota para cadastrar um novo usuário
app.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se os campos estão preenchidos
  if (!nome || !email || !senha) {
    res.status(400).send({ mensagem: 'Todos os campos são obrigatórios' });
    return;
  }

  // Verifica se o email já está cadastrado
  const queryEmail = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(queryEmail, [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar email:', err);
      res.status(500).send({ mensagem: 'Erro ao verificar email' });
      return;
    }

    if (results.length > 0) {
      res.status(400).send({ mensagem: 'Email já cadastrado' });
      return;
    }

    // Insere o usuário no banco de dados
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, results) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send({ mensagem: 'Erro ao cadastrar usuário' });
        return;
      }

      res.send({ mensagem: 'Usuário cadastrado com sucesso!' });
    });
  });
});

// Rota para login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verifica se os campos estão preenchidos
  if (!email || !senha) {
    res.status(400).send({ mensagem: 'Todos os campos são obrigatórios' });
    return;
  }

  // Verifica se o email e senha estão corretos
  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro ao verificar login:', err);
      res.status(500).send({ mensagem: 'Erro ao verificar login' });
      return;
    }

    if (results.length === 0) {
      res.status(401).send({ mensagem: 'Email ou senha incorretos' });
      return;
    }

    res.send({ mensagem: 'Login realizado com sucesso!' });
  });
});

// Rota para alterar senha
app.put('/alterar-senha', (req, res) => {
  const { email, senhaAtual, novaSenha } = req.body;

  // Verifica se os campos estão preenchidos
  if (!email || !senhaAtual || !novaSenha) {
    res.status(400).send({ mensagem: 'Todos os campos são obrigatórios' });
    return;
  }

  // Verifica se o email e senha atual estão corretos
  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(query, [email, senhaAtual], (err, results) => {
    if (err) {
      console.error('Erro ao verificar login:', err);
      res.status(500).send({ mensagem: 'Erro ao verificar login' });
      return;
    }

    if (results.length === 0) {
      res.status(401).send({ mensagem: 'Email ou senha incorretos' });
      return;
    }

    // Altera a senha
    const queryAlterar = 'UPDATE usuarios SET senha = ? WHERE email = ?';
    db.query(queryAlterar, [novaSenha, email], (err, results) => {
      if (err) {
        console.error('Erro ao alterar senha:', err);
        res.status(500).send({ mensagem: 'Erro ao alterar senha' });
        return;
      }

      res.send({ mensagem: 'Senha alterada com sucesso!' });
    });
  });
});

// Inicia o servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});