const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'bbdd.pattydev.com',
  user: 'ddb254183',
  password: '03111965.pcM',
  database: 'ddb254183',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = db;
