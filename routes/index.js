const express = require('express');
const router = express.Router();
const productsRoutes = require('./productsRoutes');
const categoriesRoutes = require('./categoriesRoutes');
const authRoutes = require('./authRoutes');
const authRoutesEmployees = require('./authRoutesEmployees');
const customersRoutes = require('./customersRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const employeesRoutes = require('./employeesRoutes');

router.use('/products', productsRoutes); 
router.use('/categories', categoriesRoutes); 
router.use('/auth', authRoutes);    
router.use('/autEmployees', authRoutesEmployees);
router.use('/customers', customersRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/employees', employeesRoutes);

module.exports = router;
