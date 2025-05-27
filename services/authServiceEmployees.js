const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // ahora es un pool con promesas

const authenticateEmployee = async (email, password) => {
  console.log('authenticateEmployee -> email:', email);

  const [rows] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);

  if (rows.length === 0) {
    throw new Error('Empleado no encontrado');
  }

  const employee = rows[0];
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  const token = jwt.sign(
    { userId: employee.id, email: employee.email, role_id: employee.role_id },
    'sl-pcm2003',
    { expiresIn: '24h' }
  );

  return { token, userId: employee.id, role_id: employee.role_id };
};
