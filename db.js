const mysql = require('mysql2/promise'); // usa mysql2 con promesas

const config = {
  host: 'bbdd.pattydev.com',
  user: 'ddb254183',
  password: '03111965.pcM',
  database: 'ddb254183',
    charset: 'utf8mb4_general_ci'

};

console.log('Configuración de conexión a MySQL:', config);

const pool = mysql.createPool(config);


async function query(sql, params) {
  const [rows] = await pool.query(sql, params); // directamente pool.query
  return rows;
}

module.exports = {
  pool,
  query
};