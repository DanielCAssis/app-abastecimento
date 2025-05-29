const express = require('express');
const { body } = require('express-validator');
const vehicleController = require('../controllers/vehicleController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Validações
const vehicleValidation = [
  body('nome_veiculo').notEmpty().withMessage('Nome do veículo é obrigatório'),
  body('placa')
    .optional()
    .matches(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/)
    .withMessage('Placa inválida'),
  body('quilometragem_inicial')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quilometragem inicial deve ser um número positivo'),
];

// Rotas
router.use(authMiddleware); // Todas as rotas de veículos requerem autenticação

router.post('/', vehicleValidation, vehicleController.create);
router.get('/', vehicleController.list);
router.get('/:id', vehicleController.getById);
router.put('/:id', vehicleValidation, vehicleController.update);
router.delete('/:id', vehicleController.delete);

module.exports = router; 