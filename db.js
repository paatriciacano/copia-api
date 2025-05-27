const mysql = require('mysql2'); // sin promesas

const connection = mysql.createConnection({
  host: 'bbdd.pattydev.com',
  user: 'ddb254183',
  password: '03111965.pcM',
  database: 'ddb254183',
  charset: 'utf8mb4'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL.');
  }
});

module.exports = connection;