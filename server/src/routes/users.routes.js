import { Router } from 'express';
import * as ctrl from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import { authorizePermission } from '../middlewares/authorizePermission.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema } from '../schemas/user.schema.js';
import { Privilege } from '../config/rbac.constants.js';

const r = Router();

r.get('/', ...authorizePermission(Privilege.USERS_SEE_ALL), ctrl.list);
r.get('/:id', authMiddleware, ctrl.getById);
r.post(
  '/',
  ...authorizePermission(Privilege.USERS_CREATE),
  validate(createUserSchema, 'body'),
  ctrl.create
);
r.delete('/:id', ...authorizePermission(Privilege.USERS_DELETE), ctrl.remove);

export default r;
