import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../repositories/users.repository.js';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
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

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, roles },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      }
    );

    const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES,
    });

    const { password: _omit, ...safe } = user;
    return { user: safe, accessToken, refreshToken };
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    const roles = userRoles.map((ur) => ur.role.name);

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, roles },
      env.JWT_ACCESS_SECRET,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      }
    );

    const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES,
    });

    const { password: _omit, ...safe } = user;
    return { user: safe, accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await usersRepository.findById(payload.sub);
      if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

      const userRoles = await prisma.userRole.findMany({
        where: { userId: user.id },
        include: { role: true },
      });
      const roles = userRoles.map((ur) => ur.role.name);

      const accessToken = jwt.sign(
        { sub: user.id, email: user.email, roles },
        env.JWT_ACCESS_SECRET,
        {
          expiresIn: env.JWT_ACCESS_EXPIRES,
        }
      );

      return { accessToken };
    } catch {
      throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
    }
  },
};
