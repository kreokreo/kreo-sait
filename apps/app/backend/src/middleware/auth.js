import { verifyAccessToken } from '../utils/jwt.js';

// Middleware для проверки JWT токена
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Убираем "Bearer "
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message || 'Invalid token' });
  }
}

// Middleware для проверки роли
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { User } = await import('../models/User.js');
      const user = await User.findById(req.user.userId);

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}

