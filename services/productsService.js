const db = require("../db");

// Obtener todos los productos

const getAllProducts = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err.message);
    throw err;
  }
};


//Obtener todos los tamaños
const getAllSizes = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM sizes", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
// Obtener un producto por ID
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    console.log("Buscando producto con id:", id); // <-- Agregado
    db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.error("Error en la query:", err); // <-- Agregado
        return reject(err);
      }
      console.log("Resultados:", results); // <-- Agregado
      resolve(results[0]);
    });
  });
};

// Obtener productos por categoría
const getProductsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products WHERE category_id = ?",
      [category],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const createProduct = (
  name,
  description,
  ingredients,
  base_price,
  category_id,
  image_url,
  stock_pequenio,
  stock_mediano,
  stock_grande
) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO products (
        name,
        description,
        ingredients,
        base_price,
        category_id,
        image_url,
        stock_pequenio,
        stock_mediano,
        stock_grande
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        ingredients,
        base_price,
        category_id,
        image_url,
        stock_pequenio,
        stock_mediano,
        stock_grande
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve({
          id: result.insertId,
          name,
          description,
          ingredients,
          base_price,
          category_id,
          image_url,
          stock_pequenio,
          stock_mediano,
          stock_grande
        });
      }
    );
  });
};
// Actualizar un producto por ID
const updateProduct = (id, name, description, ingredients, base_price, category_id, image_url, stock_pequenio, stock_mediano, stock_grande) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE products SET
        name = ?,
        description = ?,
        ingredients = ?,
        base_price = ?,
        category_id = ?,
        image_url = ?,
        stock_pequenio = ?,
        stock_mediano = ?,
        stock_grande = ?
      WHERE id = ?
    `;
    const params = [name, description, ingredients, base_price, category_id, image_url, stock_pequenio, stock_mediano, stock_grande, id];

    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return resolve(null);
      resolve({ id, name, description, ingredients, base_price, category_id, image_url, stock_pequenio, stock_mediano, stock_grande });
    });
  });
};


// Eliminar un producto por ID
const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return resolve(null);
      resolve(true);
    });
  });
};

// Obtener la cesta por ID de cliente
const getBasketByCustomerId = (customerId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM baskets WHERE customer_id = ?",
      [customerId],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null); // No hay cesta
        resolve(results[0]); // Devolvemos la primera (y única) cesta
      }
    );
  });
};

// Añadir producto a la cesta (ya existente)
const addProductToBasket = (basketId, productId, sizeId, quantity) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO basket_details (basket_id, product_id, size_id, quantity) VALUES (?, ?, ?, ?)",
      [basketId, productId, sizeId, quantity],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          success: true,
          message: "Producto añadido a la cesta con éxito.",
          detailId: result.insertId,
          basketId,
          productId,
          sizeId,
          quantity,
        });
      }
    );
  });
};

const getBasketProductsByCustomerId = (customerId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT p.id AS product_id, p.name, p.description, p.base_price, p.image_url, s.id AS size_id, s.size_name AS size_name, s.price_modifier, bd.quantity, ((p.base_price + s.price_modifier) * bd.quantity) AS total_price FROM basket_details bd JOIN baskets b ON bd.basket_id = b.id JOIN products p ON bd.product_id = p.id JOIN sizes s ON bd.size_id = s.id WHERE b.customer_id = ? ORDER BY p.name ASC";

    db.query(query, [customerId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const updateProductQuantity = (basketId, productId, sizeId, quantity) => {
  return new Promise((resolve, reject) => {
    console.log(basketId, productId, sizeId, quantity);
    db.query(
      "UPDATE basket_details SET quantity = ? WHERE basket_id = ? AND product_id = ? AND size_id = ?",
      [quantity, basketId, productId ,sizeId],
      (err, updateResult) => {
        if (err) {
          console.error("🔴 Error al ejecutar el query:", err);
          return reject(err);
        }
        console.log("🟢 Resultado del query:", updateResult);

        if (updateResult.affectedRows === 0) {
          console.warn(
            "⚠️ No se actualizó ninguna fila (puede que no exista el producto en la cesta)."
          );
          return resolve(null);
        }
        console.log("✅ Producto actualizado correctamente");

        resolve({
          basketId,
          productId,
                    sizeId, 
          quantity,
        });
      }
    );
  });
};

const getBasketTotalByBasketId = (basketId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        SUM((p.base_price + s.price_modifier) * bd.quantity) AS total
      FROM basket_details bd
      JOIN products p ON bd.product_id = p.id
      JOIN sizes s ON bd.size_id = s.id
      WHERE bd.basket_id = ?
    `;

    db.query(query, [basketId], (err, results) => {
      if (err) return reject(err);

      const total = results[0]?.total || 0;
      console.log(total);
      resolve(total);
    });
  });
};
module.exports = {
  getAllProducts,
  getAllSizes,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToBasket,
  getBasketByCustomerId,
  getBasketProductsByCustomerId,
  updateProductQuantity,
  getBasketTotalByBasketId,
};
