import { Router } from 'express';
import { getUpdates, getUpdatesByProject, createUpdate, approveUpdate, requestChanges } from '../controllers/updateController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getUpdates);
router.get('/project/:projectId', getUpdatesByProject);
router.post('/', createUpdate);
router.post('/:id/approve', approveUpdate);
router.post('/:id/request-changes', requestChanges);

export default router;
