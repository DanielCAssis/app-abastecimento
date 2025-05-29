const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy para marcas
router.get('/marcas', async (req, res) => {
  try {
    const { data } = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar marcas FIPE' });
  }
});

// Proxy para modelos de uma marca
router.get('/marcas/:codigoMarca/modelos', async (req, res) => {
  try {
    const { codigoMarca } = req.params;
    const { data } = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar modelos FIPE' });
  }
});

// Proxy para anos de um modelo
router.get('/marcas/:codigoMarca/modelos/:codigoModelo/anos', async (req, res) => {
  try {
    const { codigoMarca, codigoModelo } = req.params;
    const { data } = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anos FIPE' });
  }
});

// Proxy para detalhes de um ano/modelo
router.get('/marcas/:codigoMarca/modelos/:codigoModelo/anos/:codigoAno', async (req, res) => {
  try {
    const { codigoMarca, codigoModelo, codigoAno } = req.params;
    const { data } = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhes FIPE' });
  }
});

module.exports = router; 