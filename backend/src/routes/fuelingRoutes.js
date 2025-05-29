const express = require('express');
const { body } = require('express-validator');
const fuelingController = require('../controllers/fuelingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Validações
const fuelingValidation = [
  body('id_veiculo').notEmpty().withMessage('Veículo é obrigatório'),
  body('data_hora').notEmpty().withMessage('Data e hora são obrigatórios'),
  body('quilometragem_atual')
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage('Quilometragem deve ser um número positivo'),
  body('litros')
    .notEmpty()
    .isFloat({ min: 0.1 })
    .withMessage('Quantidade de litros deve ser maior que zero'),
  body('valor_total')
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage('Valor total deve ser maior que zero'),
  body('tipo_combustivel')
    .optional()
    .isIn(['gasolina_comum', 'gasolina_aditivada', 'etanol', 'diesel', 'gnv'])
    .withMessage('Tipo de combustível inválido'),
];

// Rotas
router.use(authMiddleware); // Todas as rotas de abastecimentos requerem autenticação

router.post('/', fuelingValidation, fuelingController.create);
router.get('/', fuelingController.list);
router.get('/:id', fuelingController.getById);
router.put('/:id', fuelingValidation, fuelingController.update);
router.delete('/:id', fuelingController.delete);

// Rotas de relatórios
router.get('/relatorio/consumo', fuelingController.getConsumptionReport);

module.exports = router; 