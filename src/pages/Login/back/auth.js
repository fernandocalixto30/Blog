

const bcrypt = require('bcrypt');
const db = require('./db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const schema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

/**
 * Gera um token de autenticação para um usuário.
 * @param {object} usuario - O usuário autenticado.
 * @returns {string} O token de autenticação.
 */

const gerarTokenDeAutenticacao = (usuario) => {

console.log("Gerando token de autenticação para o usuário: ");


  if (!process.env.SECRET_KEY) {



    throw new Error('Variável de ambiente SECRET_KEY não definida');
  }  

  const token = jwt.sign(
 

    {
      email: usuario.email,
      nome: usuario.nome,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
  return token;
};

/**
 * Autentica um usuário.
 * @param {object} req - A requisição HTTP.
 * @param {object} res - A resposta HTTP.
 */
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
    if (!usuarioAutenticado || usuarioAutenticado.length === 0) {
      return res.status(401).json({ mensagem: 'Usuario não encontardo' });
    }
    // Verificando se o usuário encontrado tem um nome
    if (!usuarioAutenticado[0].nome) {
      return res.status(500).json({ mensagem: 'Usuário sem nome' });
    }
    // Comparando a senha
    const senhaCorreta = await bcrypt.compare(senha, usuarioAutenticado[0].senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incoreta tente novamente!' });
    }
    // Gerando o token
    const token = gerarTokenDeAutenticacao(usuarioAutenticado[0]);
    return res.json({ token, mensagem: 'Autenticação realizada com sucesso' });
  } catch (erroDeAutenticacao) {
    console.error('Erro no servidor:', erroDeAutenticacao.message);
    return res.status(500).json({ mensagem: erroDeAutenticacao.message, erro: erroDeAutenticacao.message });
  }
};

module.exports = auth;
