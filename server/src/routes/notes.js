import express from 'express';
import {
    getNotesByClient,
    createNote,
    deleteNote
} from '../controllers/noteController.js';
import { protect, requireAgency } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, requireAgency);

router.get('/client/:clientId', getNotesByClient);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;