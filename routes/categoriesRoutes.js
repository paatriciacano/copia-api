const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');


router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.put('/:id', categoriesController.updateCategory);
router.post('/', categoriesController.addCategory); 
router.delete('/:id', categoriesController.deleteCategory);


module.exports = router;
