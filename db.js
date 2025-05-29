/*const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET || 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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
*/

var mysql = require('mysql')

var { database } = require('./keys')

var { promisify } = require('util')

var conexion = mysql.createPool(database);


conexion.getConnection((error, connection) => {
	if (error)
		console.log('Problemas de conexion con mysql', error.code)
	if(connection) connection.release()
	console.log("Conectado a la BD")
})

conexion.query = promisify(conexion.query)

module.exports = conexion