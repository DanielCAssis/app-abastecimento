const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token erro' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      req.userId = decoded.id;
      req.user = user;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  return next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
}; 