const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // ahora es un pool con promesas

const authenticateEmployee = async (email, password) => {
  console.log('authenticateEmployee -> email:', email, 'password:', password);

  try {
    console.log(typeof email, email);

    const [rows] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
    console.log('Resultado consulta DB:', rows);

    if (rows.length === 0) {
      throw new Error('Empleado no encontrado');
    }

    const employee = rows[0];
    const isMatch = await bcrypt.compare(password, employee.password);
    console.log('¿Contraseña coincide?', isMatch);

    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { userId: employee.id, email: employee.email, role_id: employee.role_id },
      'sl-pcm2003',
      { expiresIn: '24h' }
    );

    return { token, userId: employee.id, role_id: employee.role_id };

  } catch (err) {
    console.error('Error en authenticateEmployee:', err);
    throw err;
  }
};


const register = (name, email, password, phone, role_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employees WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) return reject(new Error('El correo ya está registrado'));

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

        db.query(
          'INSERT INTO employees (name, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?)',
          [name, email, hashedPassword, phone, role_id],
          (err, result) => {
            if (err) return reject(err);
            resolve({ message: 'Empleado registrado correctamente' });
          }
        );
      });
    });
  });
};


module.exports = { authenticateEmployee, register };
