const { authenticateUser, registerUser } = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Recibiendo login con:', email, password); // Verifica lo que llega

  try {
    const { token, userId } = await authenticateUser(email, password); // Obtener userId
    
    res.status(200).json({ token, userId }); // Devolver token y userId
    console.log('Recibiendo :', token, userId); // Verifica lo que llega

  } catch (err) {
    console.log('Error al autenticar:', err.message); // Log del error
    res.status(401).json({ message: err.message });
  }
};

// Registro nuevo
const register = async (req, res) => {
    const { name, last_name, email, password, phone, address, birth_date } = req.body;
  
    try {
      const result = await registerUser(name, last_name, email, password, phone, address, birth_date);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
module.exports = { login, register };
