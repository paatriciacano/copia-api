
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin: 'https://www.pattydev.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api', routes);

app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '30d'
}));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
