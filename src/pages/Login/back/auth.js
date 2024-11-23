const bcrypt = require('bcrypt');
const db = require('./db');
const Joi = require('joi');
const { V4 } = require('paseto');
const { Buffer } = require('buffer');
const crypto = require('crypto');
require('dotenv').config();

// Validação de entrada usando Joi
const schema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

// Gerando o par de chaves ed25519
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

// Convertendo a chave privada para o formato binário (Buffer)


const chavePrivada = privateKey.export({ type: 'pkcs8', format: 'pem' });
console.log('Chave Privada:', chavePrivada.toString('hex'));  // Log para garantir que é um Buffer válido

// Função para gerar o token de autenticação
const gerarTokenDeAutenticacao = async (usuario) => {
  console.log("Gerando token de autenticação para o usuário:", usuario.nome);

  try {
    // Usando a chave privada para assinar o token
    const token = await V4.sign(
      {
        email: usuario.email,
        nome: usuario.nome,
        exp: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
        issuer: 'http://localhost:5173/login',
      },
      chavePrivada // Passando o Buffer da chave privada gerada
    );

    console.log("Token gerado:", token);
    return token;
  } catch (error) {
    console.error('Erro ao gerar o token:', error.message);
    throw new Error('Falha ao gerar o token');
  }
};

// Função de autenticação
const auth = async (req, res) => {
  try {
    console.log('Iniciando autenticação...');
    // Validando dados de entrada
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: 'Dados de entrada inválidos' });
    }

    const { email, senha } = req.body;

    // Consultando o banco de dados para encontrar o usuário
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [usuarioAutenticado] = await db.promise().query(query, [email]);

    if (!usuarioAutenticado?.length) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas. Por favor, verifique seu e-mail e senha.' });
    }

    // Verificando se o nome está presente no usuário
    if (!usuarioAutenticado[0].nome) {
      return res.status(500).json({ mensagem: 'Erro interno: Usuário sem nome' });
    }

    // Comparando a senha
    const senhaCorreta = await bcrypt.compare(senha, usuarioAutenticado[0].senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas. Por favor, verifique seu e-mail e senha.' });
    }

    // Gerando o token
    const token = await gerarTokenDeAutenticacao(usuarioAutenticado[0]);

    return res.json({ token, mensagem: 'Autenticação realizada com sucesso' });
  } catch (erroDeAutenticacao) {
    console.error('Erro no servidor:', erroDeAutenticacao.message);
    return res.status(500).json({ mensagem: 'Erro no servidor, tente novamente mais tarde.' });
  }
};

module.exports = auth;
