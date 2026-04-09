import { Router } from 'express';
import { getCommentsByUpdate, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/update/:updateId', getCommentsByUpdate);
router.post('/', createComment);

export default router;
