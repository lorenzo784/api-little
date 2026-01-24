import { prisma } from '../db/prisma.js';

export const roleRepository = {
  findMany: () => prisma.role.findMany({ orderBy: { id: 'desc' } }),
};
