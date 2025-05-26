// server.js
const express = require('express');
const cors = require('cors');  
const path = require('path'); // Asegúrate de importar path

const app = express();
const db = require('./db');  
const routes = require('./routes');  

app.use(cors());
app.use(express.json());  
app.use('/api', routes);  
app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '30d'
}));
app.use(cors({
  origin: 'https://www.pattydev.com', // tu frontend en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
