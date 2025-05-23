// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'serenia_latte',
  charset: 'utf8mb4' 
  
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Conexión a MySQL establecida');
  }
});

module.exports = db;
