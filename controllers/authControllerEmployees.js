const { register,authenticateEmployee } = require('../services/authServiceEmployees');



const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await authenticateEmployee(email, password);
    res.status(200).json(data); // devuelve { token, userId, role_id }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


const registerEmployee = async (req, res) => {
  const { name, email, password, phone, role_id } = req.body;

  try {
    const result = await register(name, email, password, phone, role_id);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee
};
