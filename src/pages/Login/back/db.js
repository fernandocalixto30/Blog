const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',          
    password: 'F30122006fd#', 
    database: 'blog' 
});

db.connect((err) => {
 if (err) {
 console.error('Erro ao conectar ao banco de dados:', err);
 return;
 }else{
    console.log('Conectado ao banco de dados com sucesso!');
 }

});

module.exports = db;
