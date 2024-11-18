const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { updateUserProfile } = require('./database'); // Sua função para atualizar o banco de dados

const app = express();

// Configuração do Multer para salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

const upload = multer({ storage });

// Rota para atualizar perfil com upload de foto
app.post('/perfil/atualizar', upload.single('foto'), async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Pega o token do header Authorization
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verifica o token (autentica o usuário)

    const { nome, email } = req.body;
    const fotoPerfil = req.file ? req.file.filename : null; // Se houver arquivo, pega o nome do arquivo, caso contrário, null

    // Função para atualizar o perfil no banco de dados (pode incluir nome, email e fotoPerfil)
    await updateUserProfile(decoded.userId, nome, email, fotoPerfil);

    res.json({ mensagem: 'Perfil atualizado com sucesso!', fotoPerfil });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
  }
});

