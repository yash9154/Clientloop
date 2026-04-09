import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, requireAgency } from '../middleware/auth.js';

const router = Router();

router.use(protect, requireAgency);

router.get('/dashboard', getDashboardStats);

export default router;
