import { Router } from 'express';
import usersRoutes from './users.routes.js';
import authRoutes from './auth.routes.js';
import rolesRoutes from './role.routes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);

export default router;
