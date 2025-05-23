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

db.connect((err) => {
  if (err) {
    console.error('Error en la conexión a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a la base de datos establecida');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
