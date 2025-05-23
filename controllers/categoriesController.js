const categoriesService = require("../services/categoriesService");

const getCategories = async (req, res) => {
  console.log("Obteniendo categorías...");
  try {
    const categories = await categoriesService.getAllCategories();
    console.log("Categorías obtenidas:", categories);
    res.status(200).json(categories);
  } catch (err) {
    console.log("Error al obtener categorías:", err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  console.log("Buscando categoría con ID:", id);

  try {
    const category = await categoriesService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.status(200).json(category);
  } catch (err) {
    console.log("Error al obtener categoría:", err);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await categoriesService.updateCategory(id, name);
    res.status(200).json({ message: 'Categoría actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });
    const insertId = await categoriesService.addCategory(name);
    res.status(201).json({ message: "Categoría creada", id: insertId });
  } catch (err) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await categoriesService.deleteCategory(id);
    res.status(200).json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  updateCategory,
  addCategory,
  deleteCategory
};
