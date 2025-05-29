const productsService = require('../services/productsService');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await productsService.getAllProducts();  
    res.status(200).json(products); 
  } catch (err) {
    res.status(500).json({ error: err.message });  
  }
};


// Obtener un producto por ID
const getProduct = async (req, res) => {
  const id = parseInt(req.params.id, 10);
console.log("ID recibido en backend:", id); 
  try {
    const product = await productsService.getProductById(id); 
    if (!product) return res.status(404).json({ message: 'Producto no encontradooooo' });
    res.json(product); 
    console.log("Producto obtenido:", product);
 
  } catch (err) {
    res.status(500).json({ error: err.message }); 
    console.error(err); // Esto te ayuda a ver qué falló exactamente

  }
};

//Obtener todos los tamaños
const getSizes = async (req, res) => {
  try {
    const sizes = await productsService.getAllSizes();  
    res.status(200).json(sizes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tamaños" });
  }
};



const createProduct = async (req, res) => {
  const {
    name,
    description,
    ingredients,
    base_price,
    category_id,
    stock_pequenio,
    stock_mediano,
    stock_grande
  } = req.body;
  const image_url = req.file ? req.file.filename : null;

  try {
    const newProduct = await productsService.createProduct(
      name,
      description,
      ingredients,
      base_price,
      category_id,
      image_url,
      stock_pequenio,
      stock_mediano,
      stock_grande
    );
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Editar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    ingredients,
    base_price,
    category_id,
    stock_pequenio,
    stock_mediano,
    stock_grande,
      imagen_actual

  } = req.body;
const image_url = req.file ? req.file.filename : imagen_actual || null;

  try {
    const updatedProduct = await productsService.updateProduct(
      id,
      name,
      description,
      ingredients,
      base_price,
      category_id,
      image_url,
      stock_pequenio,
      stock_mediano,
      stock_grande
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProductQuantity = async (req, res) => {
  const { basketId, productId, sizeId, quantity } = req.body; 
  console.log(basketId, productId, quantity)
  try {
    const updatedProduct = await productsService.updateProductQuantity(basketId, productId,sizeId, quantity);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productsService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado delete' });
    res.json({ message: 'Producto eliminado' });  
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
};

//Obtener productos por categorias
const getGroupedProductsByCategories = async (req, res) => {
  const category = parseInt(req.params.category, 10);
  try {
    const products = await productsService.getProductsByCategory(category);
    res.status(200).json(products);
  } catch (err) {
    console.error(err); // Esto te ayuda a ver qué falló exactamente
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
};

const addProductToBasket = async (req, res) => {
  const { customerId, productId, sizeId, quantity } = req.body;

  if (!customerId || !productId || !sizeId || !quantity) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const basket = await productsService.getBasketByCustomerId(customerId);
    if (!basket) {
      return res.status(404).json({ message: 'Cesta no encontrada.' });
    }

    const result = await productsService.addProductToBasket(basket.id, productId, sizeId, quantity);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error al añadir producto a la cesta:', err);
    res.status(500).json({ message: 'Error al añadir producto a la cesta.' });
  }
};

const getBasketProductsByCustomer = async (req, res) => {
    const id = parseInt(req.params.customerId, 10);

    if (isNaN(id)) {
      console.log("Invalid customerId: must be a number");
    }
  try {
    const products = await productsService.getBasketProductsByCustomerId(id);
        res.status(200).json(products);
            console.log("Productos obtenido:", products);

  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: "Error al obtener los productos de la cesta" });
  }
};


const getBasketTotal = async (req, res) => {
  const { basketId } = req.params;

  if (!basketId) {
    return res.status(400).json({ error: "El ID de la cesta es requerido." });
  }

  try {
    const total = await productsService.getBasketTotalByBasketId(basketId);
    res.status(200).json({ basketId, total });
    console.log("precio total omg",total)
  } catch (err) {
    console.error("Error al obtener el total del pedido:", err);
    res.status(500).json({ error: "Error al obtener el total del pedido." });
  }
};

module.exports = {
  getProducts,
  getSizes,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getGroupedProductsByCategories,
  addProductToBasket,
  getBasketProductsByCustomer,
  updateProductQuantity,
  getBasketTotal,

};
