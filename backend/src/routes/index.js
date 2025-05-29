const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const fuelingRoutes = require('./fuelingRoutes');
const postoRoutes = require('./postoRoutes');
const mediaConsumoRoutes = require('./mediaConsumoRoutes');

// Rotas de usuários
router.use('/api/users', userRoutes);

// Rotas de veículos
router.use('/api/vehicles', vehicleRoutes);

// Rotas de abastecimentos
router.use('/api/fuelings', fuelingRoutes);

// Rotas de postos
router.use('/api/postos', postoRoutes);

// Rotas de média de consumo
router.use('/api/medias-consumo', mediaConsumoRoutes);

module.exports = router; 