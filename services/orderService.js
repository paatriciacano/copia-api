const db = require("../db");

const generatePickupCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const createOrder = (customerId, orderType) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) return reject(err);

      const basketSql = `
        SELECT bd.product_id, bd.size_id, bd.quantity, p.base_price, s.price_modifier
        FROM basket_details bd
        JOIN products p ON bd.product_id = p.id
        JOIN sizes s ON bd.size_id = s.id
        WHERE bd.basket_id = ?`;

      db.query(basketSql, [customerId], (err, basketItems) => {
        if (err) return db.rollback(() => reject(err));
        if (basketItems.length === 0)
          return db.rollback(() => reject(new Error("La cesta está vacía")));

        let total = 0;
        const details = basketItems.map((item) => {
          const unitPrice =
            parseFloat(item.base_price) + parseFloat(item.price_modifier);
          const totalPrice = unitPrice * item.quantity;
          total += totalPrice;
          return {
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            total_price_product: totalPrice,
          };
        });

        const pickupCode = generatePickupCode();

        const insertOrderSql = `
          INSERT INTO orders (customer_id, total_price, order_date, pickup_code, order_type)
          VALUES (?, ?, NOW(), ?, ?)`;

        db.query(insertOrderSql, [customerId, total, pickupCode, orderType], (err, result) => {
          if (err) return db.rollback(() => reject(err));

          const orderId = result.insertId;

          const insertDetails = (index) => {
            if (index === details.length) {
              db.query('DELETE FROM basket_details WHERE basket_id = ?', [customerId], (err) => {
                if (err) return db.rollback(() => reject(err));

                db.commit((err) => {
                  if (err) return db.rollback(() => reject(err));
                  resolve({ order_id: orderId, pickup_code: pickupCode });
                });
              });
              return;
            }

            const d = details[index];
            let stockColumn;
            switch (d.size_id) {
              case 1: stockColumn = "stock_pequeño"; break;
              case 2: stockColumn = "stock_mediano"; break;
              case 3: stockColumn = "stock_grande"; break;
              default:
                return db.rollback(() => reject(new Error(`Tamaño inválido: ${d.size_id}`)));
            }

            db.query(
              `INSERT INTO order_details (order_id, product_id, size_id, quantity, total_price_product)
               VALUES (?, ?, ?, ?, ?)`,
              [orderId, d.product_id, d.size_id, d.quantity, d.total_price_product],
              (err) => {
                if (err) return db.rollback(() => reject(err));

                // Ahora actualizamos el stock
                db.query(
                  `UPDATE products
                   SET ${stockColumn} = ${stockColumn} - ?
                   WHERE id = ? AND ${stockColumn} >= ?`,
                  [d.quantity, d.product_id, d.quantity],
                  (err, result) => {
                    if (err) return db.rollback(() => reject(err));

                    if (result.affectedRows === 0) {
                      return db.rollback(() =>
                        reject(new Error(
                          `Stock insuficiente para este producto ${d.product_id} (tamaño ${d.size_id})`
                        ))
                      );
                    }

                    insertDetails(index + 1);
                  }
                );
              }
            );
          };

          insertDetails(0);
        });
      });
    });
  });
};


const getOrdersByCustomerId = (customerId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.order_date,
        o.pickup_code,
        o.order_type,
        od.product_id,
        p.name AS product_name,
        p.description,
        p.image_url,
        od.size_id,
        s.size_name,
        s.price_modifier,
        od.quantity,
        od.total_price_product
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON od.product_id = p.id
      JOIN sizes s ON od.size_id = s.id
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC, o.pickup_code, od.id
    `;

    db.query(query, [customerId], (err, results) => {
      if (err) return reject(err);

      // Agrupar resultados por pickup_code
      const ordersMap = new Map();

      results.forEach(row => {
        if (!ordersMap.has(row.pickup_code)) {
          ordersMap.set(row.pickup_code, {
            pickup_code: row.pickup_code,
            total_price: 0,
            order_date: row.order_date,
            order_type: row.order_type,
            details: []
          });
        }

        const group = ordersMap.get(row.pickup_code);

        // Acumular total_price por pickup_code
        group.total_price += parseFloat(row.total_price_product);

        group.details.push({
          order_id: row.order_id,
          product_id: row.product_id,
          product_name: row.product_name,
          description: row.description,
          image_url: row.image_url,
          size_id: row.size_id,
          size_name: row.size_name,
          price_modifier: row.price_modifier,
          quantity: row.quantity,
          total_price_product: row.total_price_product
        });
      });

      resolve(Array.from(ordersMap.values()));
    });
  });
};

const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.id AS order_id,
        o.customer_id,
        o.total_price,
        o.order_date,
        o.pickup_code,
        o.order_type,
        od.product_id,
        p.name AS product_name,
        p.description,
        p.image_url,
        od.size_id,
        s.size_name,
        s.price_modifier,
        od.quantity,
        od.total_price_product
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON od.product_id = p.id
      JOIN sizes s ON od.size_id = s.id
      ORDER BY o.order_date DESC, o.pickup_code, od.id
    `;

    db.query(query, (err, results) => {
      if (err) return reject(err);

      const ordersMap = new Map();

      results.forEach(row => {
        const key = row.pickup_code;

        if (!ordersMap.has(key)) {
          ordersMap.set(key, {
            order_id: row.order_id,
            customer_id: row.customer_id,
            pickup_code: row.pickup_code,
            total_price: 0,
            order_date: row.order_date,
            order_type: row.order_type,
            details: []
          });
        }

        const group = ordersMap.get(key);

        group.total_price += parseFloat(row.total_price_product);

        group.details.push({
          product_id: row.product_id,
          product_name: row.product_name,
          description: row.description,
          image_url: row.image_url,
          size_id: row.size_id,
          size_name: row.size_name,
          price_modifier: row.price_modifier,
          quantity: row.quantity,
          total_price_product: row.total_price_product
        });
      });

      resolve(Array.from(ordersMap.values()));
    });
  });
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrdersByCustomerId
};
