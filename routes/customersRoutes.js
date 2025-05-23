const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');

router.get('/', customersController.getCustomers); 

router.get('/:id', customersController.getCustomer);

router.put('/:id', customersController.updateCustomer);

module.exports = router;
