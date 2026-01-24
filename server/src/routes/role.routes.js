import { Router } from 'express';
import * as ctrl from '../controllers/role.controller.js';

const r = Router();

r.get('/', ctrl.list);

export default r;
