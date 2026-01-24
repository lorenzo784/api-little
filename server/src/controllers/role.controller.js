import { roleService } from '../services/role.service.js';

export async function list(_req, res, next) {
  try {
    const roles = await roleService.list();
    res.json(roles);
  } catch (e) {
    next(e);
  }
}
