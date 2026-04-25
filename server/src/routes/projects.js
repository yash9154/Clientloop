import express from 'express';
import {
    getProjectsByClient,
    getProjectsByClientForClient,
    getProject,
    createProject,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';
import { protect, requireAgency, requireClient } from '../middleware/auth.js';

const router = express.Router();

// Client route MUST be before /:id — otherwise Express matches /my-projects as an id
router.get('/my-projects',      protect, requireClient, getProjectsByClientForClient);

// Agency routes
router.get('/client/:clientId', protect, requireAgency, getProjectsByClient);
router.post('/',                protect, requireAgency, createProject);
router.get('/:id',              protect, requireAgency, getProject);
router.put('/:id',              protect, requireAgency, updateProject);
router.delete('/:id',           protect, requireAgency, deleteProject);

export default router;