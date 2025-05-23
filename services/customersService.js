const db = require('../db');  

const getAllCustomers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM customers', (err, results) => {
      if (err) return reject(err); 
      resolve(results);  
    });
  });
};


const getCostumerById = (id) => {
  return new Promise((resolve, reject) => {
    console.log("Buscando cliente con id:", id); 
    db.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error("Error en la query:", err); 
        return reject(err);
      }
      console.log("Resultados:", results); 
      if (results.length === 0) {
        return reject(new Error("Cliente no encontrado"));  // Si no hay resultados, rechazamos la promesa
      }
      resolve( results[0] );
    });
  });
};



const createCustomer = (name, last_name, email, password, phone, address, birth_date) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO products (name, price, description, category) VALUES (?, ?, ?, ?)', 
      [name, price, description, category], (err, result) => {
      if (err) return reject(err); 
      resolve({ id: result.insertId, name, price, description, category }); 
    });
  });
};

const updateCostumer = (name, last_name, email, phone, address, birth_date, id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE customers SET name = ?, last_name = ?, email = ?, phone = ?, address = ?, birth_date = ?  WHERE id = ?', 
      [name, last_name, email, phone, address, birth_date, id], (err, result) => {
      if (err) return reject(err);  
      if (result.affectedRows === 0) return resolve(null);  
      resolve({ id, name, last_name, email, phone, address, birth_date }); 
    });
  });
};


const deleteCustomer = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err); 
      if (result.affectedRows === 0) return resolve(null);  
      resolve(true); 
    });
  });
};


module.exports = {
  getAllCustomers,
  getCostumerById,
  createCustomer,
  updateCostumer,
  deleteCustomer
};
