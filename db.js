const mysql = require('mysql2/promise');

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: 'bbdd.pattydev.com',
      user: 'ddb254183',
      password: '03111965.pcM',
      database: 'ddb254183',
      charset: 'latin1'

    });

    const [rows] = await connection.query('SELECT NOW() as now');
    console.log(rows);

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
