// db.js
const mysql = require('mysql2/promise'); // usa mysql2 con promesas

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

module.exports = pool;
