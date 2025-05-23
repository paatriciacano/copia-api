const customersService = require("../services/customersService");

const getCustomers = async (req, res) => {
  try {
    const customers = await customersService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCustomer = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log("ID recibido en backend:", id);

  if (isNaN(id)) {
    // Verifica que el ID sea un número válido
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const customer = await customersService.getCostumerById(id);
    if (!customer)
      return res.status(404).json({ message: "Cliente no encontradooooo" });
    res.status(200).json(customer);
    console.log("Cliente obtenido:", customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

// Editar un producto
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, last_name, email, phone, address, birth_date } = req.body;
  try {
    const updatedCustomer = await customersService.updateCostumer(name, last_name, email, phone, address, birth_date, id);
    if (!updatedCustomer) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(updatedCustomer);
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomer
};
