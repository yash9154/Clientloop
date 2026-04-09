import { Router } from 'express';
import { getProjects, getProject, getProjectsByClient, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getProjects)
    .post(createProject);

router.get('/client/:clientId', getProjectsByClient);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

export default router;
