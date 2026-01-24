import { prisma } from '../db/prisma.js';

export const usersRepository = {
  findMany: () =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    }),

  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  create: (data) => prisma.user.create({ data }),
  delete: (id) => prisma.user.delete({ where: { id } }),

  update: async (id, data) => {
    const { name, email, roles } = data;

    await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    if (roles) {
      await prisma.userRole.deleteMany({ where: { userId: id } });
      if (roles.length > 0) {
        await prisma.userRole.createMany({
          data: roles.map((roleId) => ({ userId: id, roleId })),
        });
      }
    }

    return prisma.user.findUnique({
      where: { id },
      include: { roles: { select: { role: { select: { id: true, name: true } } } } },
    });
  },
};
