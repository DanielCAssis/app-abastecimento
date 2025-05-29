const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Validações
const registerValidation = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha_hash')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha_hash').notEmpty().withMessage('Senha é obrigatória'),
];

// Rotas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router; 