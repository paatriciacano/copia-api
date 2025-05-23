const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get('/:customerId', orderController.getOrdersByCustomer);
router.get("/", orderController.getAllOrders); // <-- ESTA ES LA NUEVA

module.exports = router;
