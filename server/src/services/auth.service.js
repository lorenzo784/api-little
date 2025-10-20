import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../repositories/users.repository.js';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { RoleType } from '../config/rbac.constants.js';

export const authService = {
  async signup({ email, password, name }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await usersRepository.create({ email, password: hashed, name });

    const defaultRole = await prisma.role.upsert({
      where: { name: RoleType.USER },
      update: {},
      create: { name: RoleType.USER },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: defaultRole.id } },
      update: {},
      create: { userId: user.id, roleId: defaultRole.id },
    });
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });
    const roles = userRoles.map((ur) => ur.role.name);
    const token = jwt.sign({ sub: user.id, email: user.email, roles }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
    const { password: _omit, ...safe } = user;
    return { user: safe, token };
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });
    const roles = userRoles.map((ur) => ur.role.name);
    const token = jwt.sign({ sub: user.id, email: user.email, roles }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
    const { password: _omit, ...safe } = user;
    return { user: safe, token };
  },
};
