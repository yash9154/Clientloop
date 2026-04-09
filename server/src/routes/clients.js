import { Router } from 'express';
import { getClients, getClient, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { protect, requireAgency } from '../middleware/auth.js';

const router = Router();

// All routes require authentication + agency role
router.use(protect, requireAgency);

router.route('/')
    .get(getClients)
    .post(createClient);

router.route('/:id')
    .get(getClient)
    .put(updateClient)
    .delete(deleteClient);

export default router;
