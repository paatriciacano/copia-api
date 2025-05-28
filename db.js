const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar si se puede conectar
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión inicial:', err.message);
  } else {
    console.log('Conectado exitosamente al pool');
    connection.release();
  }
});

const promisePool = pool.promise();
module.exports = promisePool;
