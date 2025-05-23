const express = require('express');
const router = express.Router();
const authControllerEmployees = require('../controllers/authControllerEmployees');

router.post('/', authControllerEmployees.registerEmployee);
router.post('/login', authControllerEmployees.loginEmployee);

module.exports = router;
