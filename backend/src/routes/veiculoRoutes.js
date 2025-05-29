const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas existentes
router.get('/', veiculoController.listarVeiculos);
router.post('/', veiculoController.criarVeiculo);
router.get('/:id', veiculoController.buscarVeiculo);
router.put('/:id', veiculoController.atualizarVeiculo);
router.delete('/:id', veiculoController.deletarVeiculo);

// Novas rotas para autonomia e lembretes
router.get('/:id/autonomia', veiculoController.calcularAutonomia);
router.get('/autonomia', veiculoController.calcularPrevisaoAbastecimento);

module.exports = router; 