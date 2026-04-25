import express from 'express';
import { getCommentsByUpdate, createComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/update/:updateId', protect, getCommentsByUpdate);
router.post('/',                protect, createComment);
router.delete('/:id',           protect, deleteComment);

export default router;