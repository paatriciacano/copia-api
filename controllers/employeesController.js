const employeesServices = require("../services/employeesService");

const getEmployees = async (req, res) => {
  try {
    const employees = await employeesServices.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employees = await employeesServices.getAllEmployeById(id);
    res.status(200).json(employees); 

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Editar empleado
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role_id } = req.body;

  try {
    const result = await employeesServices.updateEmployee(id, name, email, phone, role_id);
    res.status(200).json({ message: 'Empleado actualizado', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el empleado' });
  }
};

// Eliminar empleado
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await employeesServices.deleteEmployee(id);
    res.status(200).json({ message: 'Empleado eliminado', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el empleado' });
  }
};

module.exports = {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById
};
