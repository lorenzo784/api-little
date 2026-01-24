import { roleRepository } from '../repositories/role.repository.js';

export const roleService = {
  async list() {
    return roleRepository.findMany();
  },
};
