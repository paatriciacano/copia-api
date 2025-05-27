// authServiceEmployees.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createConnection = require('../db');

const authenticateEmployee = (email, password) => {
  console.log('authenticateEmployee -> email:', email);

  return new Promise((resolve, reject) => {
    const db = createConnection();

    db.query('SELECT * FROM employees WHERE email = ?', [email], (err, results) => {
        if (err) {
          db.end();
          return reject(err);
        }

        if (results.length === 0) {
          db.end();
          return reject(new Error('Empleado no encontrado'));
        }

      const employee = results[0];
      bcrypt.compare(password, employee.password, (err, isMatch) => {
        db.end();
        if (err) return reject(err);
        if (!isMatch) return reject(new Error('Contraseña incorrecta'));

        const token = jwt.sign(
          { userId: employee.id, email: employee.email, role_id: employee.role_id },
          'sl-pcm2003', // clave secreta
          { expiresIn: '24h' }
        );
        resolve({ token, userId: employee.id, role_id: employee.role_id });
      });
    });
  });
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
