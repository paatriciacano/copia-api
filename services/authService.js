const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');  


const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {

    db.query('SELECT * FROM customers WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return reject(new Error('Usuario no encontrado'));
      }

      const user = results[0]; // Solo hay un usuario con este email

      // Comparar contraseñas usando bcrypt.compare
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return reject(err);
        if (!isMatch) {
          return reject(new Error('Contraseña incorrecta'));
        }

        // Si la contraseña es correcta, generamos el JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, 'sl-pcm2003', { expiresIn: '24h' });
        resolve({ token, userId: user.id });
      });
    });
  });
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
