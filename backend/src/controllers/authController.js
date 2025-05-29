const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const user = await User.create(req.body);

    user.senha_hash = undefined;

    return res.status(201).json({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha_hash } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.validPassword(senha_hash))) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    user.senha_hash = undefined;

    return res.json({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['senha_hash'] },
      include: [
        {
          association: 'vehicles',
          attributes: ['id', 'nome_veiculo', 'placa'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}; 