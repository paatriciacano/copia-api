const cartService = require("../services/cartService");


const addToCart = async (req, res) => {
  const { basket_id, product_id, size_id, quantity } = req.body;

  if (
    !basket_id ||
    !product_id ||
    !size_id ||
    !quantity ||
    isNaN(basket_id) ||
    isNaN(product_id) ||
    isNaN(size_id) ||
    isNaN(quantity)
  ) {
    return res.status(400).json({ error: "Datos inválidos o incompletos" });
  }

  try {
    const result = await cartService.addToCart(
      basket_id,
      product_id,
      size_id,
      quantity
    );
    res.status(201).json(result);
    console.log("Producto añadido a la cesta:", result);
  } catch (err) {
    console.error("Error al añadir al carrito:", err);
    res.status(500).json({ error: "Error al añadir el producto a la cesta" });
  }
};

const removeFromCart = async (req, res) => {
  const { basket_id, product_id, size_id } = req.body;
  if (
    !basket_id ||
    !product_id ||
    !size_id ||
    isNaN(basket_id) ||
    isNaN(product_id) ||
    isNaN(size_id)
  ) {
    return res.status(400).json({ error: "Datos inválidos o incompletos" });
  }

  try {
      console.log(basket_id, product_id, size_id);

    const result = await cartService.removeFromCart(
      basket_id,
      product_id,
      size_id
    );
    res.status(200).json(result);
    console.log("Producto eliminado de la cesta:", result);
  } catch (err) {
    console.error("Error al eliminar del carrito:", err);
    res.status(500).json({ error: "Error al eliminar el producto de la cesta" });
  }
};


module.exports = {
  addToCart,
  removeFromCart
};