const express = require('express');
const router = express.Router();
const { getMediaConsumo, recalcularMediaConsumo, getAllMediasConsumo } = require('../controllers/mediaConsumoController');
const authMiddleware = require('../middleware/auth');

// Rota para buscar a média de consumo de todos os veículos
router.get('/', getAllMediasConsumo);

// Rota para obter a média de consumo de um veículo
router.get('/:idVeiculo', authMiddleware, (req, res, next) => {
  console.log('[DEBUG] GET /api/medias-consumo/:idVeiculo');
  next();
}, getMediaConsumo);

// Rota para recalcular a média de consumo de um veículo
router.post('/:idVeiculo/recalcular', authMiddleware, (req, res, next) => {
  console.log('[DEBUG] POST /api/medias-consumo/:idVeiculo/recalcular');
  next();
}, recalcularMediaConsumo);

module.exports = router; 