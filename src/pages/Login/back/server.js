// require('dotenv').config({ path: '../../../../.env' });
const express = require('express');




const app = express();
const auth = require('./auth'); 
const cors = require('cors');

app.use(cors()); 
app.use(express.json());

app.post('/login', auth);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
