const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // ✅ Importar antes de usarlo
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://www.pattydev.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', routes);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/*app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '30d'
}));

app.get('/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: true });
  } catch (err) {
    res.status(500).json({ status: 'error', db: false, message: err.message });
  }
});*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;