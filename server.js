// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const db = require('./db');
const routes = require('./routes');

app.use(express.json());
app.use(cors({
  origin: 'https://www.pattydev.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/api', routes);

app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '30d'
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));