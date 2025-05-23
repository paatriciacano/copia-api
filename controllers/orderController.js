const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  const { customerId, orderType } = req.body;

  console.log("id del cliente order", customerId);
  if (!customerId || !orderType) {
    return res.status(400).json({ error: "Faltan datos del pedido" });
  }

  try {
    const result = await orderService.createOrder(customerId, orderType);
    res.status(201).json({
      message: "Pedido realizado con éxito",
      orderId: result.order_id,
      pickupCode: result.pickup_code,
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return res.status(400).json({ message: error.message || "Error al procesar el pedido" });
  }
};


const getOrdersByCustomer = async (req, res) => {
  const customerId = parseInt(req.params.customerId, 10);

  if (isNaN(customerId)) {
    return res.status(400).json({ error: "El ID del cliente debe ser un número válido" });
  }

  try {
    const orders = await orderService.getOrdersByCustomerId(customerId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos del cliente" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener todos los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrdersByCustomer
};
