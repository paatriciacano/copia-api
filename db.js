// db.js
const mysql = require('mysql2/promise'); // usa mysql2 con promesas
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_CHARSET: process.DB_CHARSET, 
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: process.DB_CHARSET || 'utf8mb4', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
