import bcrypt from 'bcryptjs';
import { usersRepository } from '../repositories/users.repository.js';

export const usersService = {
  async list() {
    return usersRepository.findMany();
  },
  async getById(id) {
    const user = await usersRepository.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return user;
  },
  async create({ email, password, name }) {
    const existing = await usersRepository.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const { password: _omit, ...user } = await usersRepository.create({
      email,
      password: hashed,
      name,
    });
    return user;
  },
  async remove(id) {
    try {
      return await usersRepository.delete(id);
    } catch {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
  },
};
