import { PrismaClient } from '@prisma/client';
import { RoleType, Privilege, ROLE_PERMISSIONS } from '../src/config/rbac.constants.js';

const prisma = new PrismaClient();

async function main() {
  const rolesByName = {};
  const ROLES = Object.values(RoleType);
  for (const r of ROLES) {
    rolesByName[r] = await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r },
    });
  }

  const permsByName = {};
  const PERMISSIONS = Object.values(Privilege);
  for (const p of PERMISSIONS) {
    permsByName[p] = await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p },
    });
  }

  for (const [roleName, permList] of Object.entries(ROLE_PERMISSIONS)) {
    const role = rolesByName[roleName];
    if (!role) continue;
    for (const p of permList) {
      const perm = permsByName[p];
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  const roleUser = rolesByName[RoleType.USER];
  const users = await prisma.user.findMany({ select: { id: true } });
  for (const u of users) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: u.id, roleId: roleUser.id } },
      update: {},
      create: { userId: u.id, roleId: roleUser.id },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const user = await prisma.user.findUnique({ where: { email: adminEmail } });
    const adminRole = rolesByName[RoleType.ADMIN];
    if (user && adminRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
        update: {},
        create: { userId: user.id, roleId: adminRole.id },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
