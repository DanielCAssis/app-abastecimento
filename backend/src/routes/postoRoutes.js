const express = require('express');
const router = express.Router();
const postoController = require('../controllers/postoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de CRUD de postos
router.get('/', postoController.listar);
router.post('/', postoController.criar);
router.put('/:id', postoController.atualizar);
router.delete('/:id', postoController.deletar);

// Rotas de preços
router.get('/precos', postoController.buscarUltimoPreco);
router.post('/precos', postoController.registrarPreco);

module.exports = router; 