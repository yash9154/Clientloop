import express from 'express';
import {
    getUpdatesByClient,
    getMyUpdates,
    createUpdate,
    editUpdate,
    deleteUpdate,
    approveUpdate,
    requestChanges
} from '../controllers/updateController.js';
import { protect, requireAgency, requireClient } from '../middleware/auth.js';

const router = express.Router();

// Agency routes
router.get('/client/:clientId', protect, requireAgency, getUpdatesByClient);
router.post('/', protect, requireAgency, createUpdate);
router.put('/:id', protect, requireAgency, editUpdate);
router.delete('/:id', protect, requireAgency, deleteUpdate);

// Client routes
router.get('/my-updates', protect, requireClient, getMyUpdates);
router.put('/:id/approve', protect, requireClient, approveUpdate);
router.put('/:id/request-changes', protect, requireClient, requestChanges);

export default router;