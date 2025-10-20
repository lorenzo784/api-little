import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../repositories/users.repository.js';
import { env } from '../config/env.js';

export const authService = {
  async signup({ email, password, name }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await usersRepository.create({ email, password: hashed, name });
    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
    const { password: _omit, ...safe } = user;
    return { user: safe, token };
  },

  async login({ email, password }) {
    const user = await usersRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
    const { password: _omit, ...safe } = user;
    return { user: safe, token };
  },
};
