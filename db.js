const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');
console.log('DBHOST:', process.env.DB_HOST);
console.log('DBUSER:', process.env.DB_USER);
console.log('DBPASS:', process.env.DB_PASS ? '***' : undefined);
console.log('DBNAME:', process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);  // salir si no conecta
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

module.exports = db;
