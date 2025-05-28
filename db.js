
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'bbdd.pattydev.com',
  user: 'ddb254183',
  password: '03111965.pcM',
  database: 'ddb254183',


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
