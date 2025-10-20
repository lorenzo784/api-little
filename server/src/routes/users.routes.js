import { Router } from 'express';
import * as ctrl from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema } from '../schemas/user.schema.js';

const r = Router();

r.get('/', authMiddleware, ctrl.list);
r.get('/:id', authMiddleware, ctrl.getById);
r.post('/', authMiddleware, validate(createUserSchema, 'body'), ctrl.create);
r.delete('/:id', authMiddleware, ctrl.remove);

export default r;
