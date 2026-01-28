import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';

const r = Router();

r.post('/signup', validate(signupSchema, 'body'), ctrl.signup);
r.post('/login', validate(loginSchema, 'body'), ctrl.login);
r.post('/refresh', ctrl.refresh);

export default r;
