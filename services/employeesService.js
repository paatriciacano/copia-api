const db = require('../db');

const getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


  const getAllEmployeById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM employees where id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); 
    });
  });
};

// Actualizar empleado
const updateEmployee = (id, name, email, phone, role_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, role_id = ? WHERE id = ?';
    db.query(sql, [name, email, phone, role_id, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Eliminar empleado
const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM employees WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getAllEmployeById
};
