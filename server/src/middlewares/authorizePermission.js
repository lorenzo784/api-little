import { authMiddleware } from './auth.js';
import { prisma } from '../db/prisma.js';

export function authorizePermission(...requiredPermissions) {
  return [
    authMiddleware,
    async (req, res, next) => {
      try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const userPermissions = new Set(
          user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.name))
        );

        const ok = requiredPermissions.every((p) => userPermissions.has(p));
        if (!ok) return res.status(403).json({ message: 'Forbidden' });

        return next();
      } catch (e) {
        return next(e);
      }
    },
  ];
}
