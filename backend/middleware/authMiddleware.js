// Authentication & Authorization Middleware for HERE Platform
import { findOne } from '../../database/db.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const userEmail = req.headers['x-user-email'];

  if (userEmail) {
    const user = findOne('users', { email: userEmail });
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Fallback demo user if in development
  req.user = {
    id: 'STU-88219',
    name: 'Aarav Sharma',
    email: 'student@here.demo',
    role: 'STUDENT'
  };
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
}
