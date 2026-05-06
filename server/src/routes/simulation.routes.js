import { Router } from 'express';
import {
  getAllSimulations,
  getSimulationById,
  exportToExcel,
} from '../controllers/simulation.controller.js';

const router = Router();

router.get('/', getAllSimulations);
router.get('/:id', getSimulationById);
router.get('/export/:id', exportToExcel);

export default router;
