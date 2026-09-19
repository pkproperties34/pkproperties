import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, authorize('projects.create'), createProject);

router.route('/:id')
  .put(protect, authorize('projects.update'), updateProject)
  .delete(protect, authorize('projects.delete'), deleteProject);

router.get('/details/:slug', getProjectBySlug); // Avoid conflict with /:id

export default router;
