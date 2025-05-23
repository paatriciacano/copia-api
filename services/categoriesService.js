const db = require('../db');  

const getAllCategories = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM categories', (err, results)  => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  const getCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); 
    });
  });
};

const updateCategory = (id, name) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const addCategory = (name) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
  module.exports = {
    getAllCategories,
    getCategoryById,
    updateCategory,
    addCategory,
    deleteCategory
  };
  