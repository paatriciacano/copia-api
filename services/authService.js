const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');  


const authenticateUser = async (email, password)=> {
try {
const [results] = await db.query('SELECT * FROM employees WHERE email = ?', [email]);

    if (results.length === 0) {
      throw new Error('Empleado no encontrado');
    }

    const employee = results[0];

    const isMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, employee.password, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { userId: employee.id, email: employee.email, role_id: employee.role_id },
      'sl-pcm2003',
      { expiresIn: '24h' }
    );

    return { token, userId: employee.id, role_id: employee.role_id };

  } catch (error) {
    throw error;
  }
};


const registerUser = (name, last_name, email, password, phone, address, birth_date) => {
  return new Promise((resolve, reject) => {
    // Comprobamos si ya existe ese email
    db.query('SELECT * FROM customers WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) return reject(new Error('El correo ya está registrado'));

      // Encriptamos la contraseña
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

        const registration_date = new Date();

        db.query(
          'INSERT INTO customers (name, last_name, email, password, phone, address, birth_date, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [name, last_name, email, hashedPassword, phone, address, birth_date, registration_date],
          (err, result) => {
            if (err) return reject(err);
            resolve({ message: 'Usuario registrado correctamente' });
          }
        );
      });
    });
  });
};

module.exports = { authenticateUser, registerUser };
