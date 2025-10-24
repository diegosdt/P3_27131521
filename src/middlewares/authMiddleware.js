const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'fail', message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ status: 'fail', message: 'Token inválido' });
  }
};
