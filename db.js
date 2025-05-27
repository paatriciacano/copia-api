const mysql = require('mysql2/promise'); // usa mysql2 con promesas

const config = {
  host: 'bbdd.pattydev.com',
  user: 'ddb254183',
  password: '03111965.pcM',
  database: 'ddb254183',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Configuración de conexión a MySQL:', config);

const pool = mysql.createPool(config);

async function query(sql, params) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

module.exports = {
  pool,
  query
};