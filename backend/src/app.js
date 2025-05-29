const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://posto.assiscode.tech'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(routes);

module.exports = app; 