import { usersService } from '../services/users.service.js';
import { idParamSchema } from '../schemas/user.schema.js';

export async function list(_req, res, next) {
  try {
    const users = await usersService.list();
    res.json(users);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const user = await usersService.getById(id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const user = await usersService.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = idParamSchema.parse(req.params);
    await usersService.remove(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const userData = req.body;

    const updatedUser = await usersService.update(id, userData);
    res.json(updatedUser);
  } catch (e) {
    next(e);
  }
}
