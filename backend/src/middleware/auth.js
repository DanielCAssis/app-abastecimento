const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('[Auth] Token não fornecido');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      console.log('[Auth] Token mal formatado');
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      console.log('[Auth] Token mal formatado (Bearer)');
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('[Auth] Token inválido:', err.message);
        return res.status(401).json({ error: 'Token inválido' });
      }

      req.user = decoded;
      console.log('[Auth] Usuário autenticado:', decoded.id);
      return next();
    });
  } catch (error) {
    console.error('[Auth] Erro na autenticação:', error);
    return res.status(500).json({ error: 'Erro na autenticação' });
  }
};

module.exports = authMiddleware; 