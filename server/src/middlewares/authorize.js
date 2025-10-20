import { authMiddleware } from './auth.js';

export function authorize(...roles) {
  return [
    authMiddleware,
    (req, res, next) => {
      const payloadRoles = Array.isArray(req.user?.roles)
        ? req.user.roles
        : req.user?.role
          ? [req.user.role]
          : [];
      if (payloadRoles.length === 0) return res.status(401).json({ message: 'Unauthorized' });
      if (roles.length > 0 && !payloadRoles.some((r) => roles.includes(r))) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    },
  ];
}
