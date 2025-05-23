const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const productsController = require('../controllers/productsController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.get('/sizes', productsController.getSizes); 

router.get('/', productsController.getProducts);

router.get('/:id', productsController.getProduct);

router.get('/category/:category', productsController.getGroupedProductsByCategories); 


router.post('/', upload.single('image'), productsController.createProduct);

router.post('/basket', productsController.addProductToBasket);


router.put('/:id', upload.single('image'), productsController.updateProduct);

router.put('/basket/update', productsController.updateProductQuantity);


router.delete('/:id', productsController.deleteProduct);


router.get('/basket/:customerId', productsController.getBasketProductsByCustomer); 

router.get('/basket/:basketId/total', productsController.getBasketTotal);

module.exports = router;
