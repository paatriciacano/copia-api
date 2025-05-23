const db = require("../db");

const addToCart = (basketId, productId, sizeId, quantity) => {
  return new Promise((resolve, reject) => {
    // Obtenemos el stock correspondiente al tamaño
    const stockColumn =
      sizeId === 1
        ? "stock_pequeño"
        : sizeId === 2
        ? "stock_mediano"
        : "stock_grande";

    db.query(
      `SELECT ${stockColumn} AS stock FROM products WHERE id = ?`,
      [productId],
      (err, stockResults) => {
        if (err) return reject(err);

        const stock = stockResults[0]?.stock ?? 0;

        // Ahora obtenemos si ya hay una línea en la cesta
        db.query(
          "SELECT quantity FROM basket_details WHERE basket_id = ? AND product_id = ? AND size_id = ?",
          [basketId, productId, sizeId],
          (err2, results) => {
            if (err2) return reject(err2);

            const currentQuantity = results[0]?.quantity ?? 0;
            const newQuantity = currentQuantity + quantity;

            // Verificamos si hay stock suficiente
            if (newQuantity > stock) {
              return reject({
                message: `Solo quedan ${stock} unidades en stock para ese tamaño.`,
              });
            }

            // Si hay stock suficiente, actualizamos o insertamos
            if (results.length > 0) {
              db.query(
                "UPDATE basket_details SET quantity = ? WHERE basket_id = ? AND product_id = ? AND size_id = ?",
                [newQuantity, basketId, productId, sizeId],
                (err3, result3) => {
                  if (err3) return reject(err3);

                  resolve({
                    success: true,
                    message: "Cantidad actualizada en la cesta.",
                    basketId,
                    productId,
                    sizeId,
                    quantity: newQuantity,
                  });
                }
              );
            } else {
              db.query(
                "INSERT INTO basket_details (basket_id, product_id, size_id, quantity) VALUES (?, ?, ?, ?)",
                [basketId, productId, sizeId, quantity],
                (err4, result4) => {
                  if (err4) return reject(err4);

                  resolve({
                    success: true,
                    message: "Producto añadido a la cesta con éxito.",
                    detailId: result4.insertId,
                    basketId,
                    productId,
                    sizeId,
                    quantity,
                  });
                }
              );
            }
          }
        );
      }
    );
  });
};

const removeFromCart = (basketId, productId, sizeId) => {
  console.log(basketId, productId, sizeId);

  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM basket_details WHERE basket_id = ? AND product_id = ? AND size_id = ?",
      [basketId, productId, sizeId],
      (err, result) => {
        if (err) return reject(err);

        if (result.affectedRows > 0) {
          resolve({
            success: true,
            message: "Producto eliminado de la cesta.",
            basketId,
            productId,
            sizeId,
          });
        } else {
          resolve({
            success: false,
            message: "El producto no se encontró en la cesta.",
            basketId,
            productId,
            sizeId,
          });
        }
      }
    );
  });
};

module.exports = {
  addToCart,
  removeFromCart,
};
