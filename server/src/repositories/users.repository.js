import { prisma } from '../db/prisma.js';

export const usersRepository = {
  findMany: () => prisma.user.findMany({ orderBy: { id: 'desc' } }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  create: (data) => prisma.user.create({ data }),
  delete: (id) => prisma.user.delete({ where: { id } }),
};
