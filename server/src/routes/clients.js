import express from 'express';
import {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clientController.js';
import { protect, requireAgency } from '../middleware/auth.js';

const router = express.Router();

// All client routes require agency login
router.use(protect, requireAgency);

router.get('/', getClients);
router.post('/', createClient);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;