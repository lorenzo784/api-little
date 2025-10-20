import { authService } from '../services/auth.service.js';

export async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
