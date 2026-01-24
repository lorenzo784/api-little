import { PrismaClient } from '@prisma/client';
import { RoleType, Privilege, ROLE_PERMISSIONS } from '../src/config/rbac.constants.js';
import bcrypt from 'bcryptjs';

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
    const hashedPassword = await bcrypt.hash('lopezlopez', 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'lorenzo',
      },
    });
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
