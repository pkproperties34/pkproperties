import express from 'express';
import {
  createLead,
  getLeads,
  updateLead,
  addLeadNote
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for website forms
router.post('/', createLead);

// Protected CRM routes
router.use(protect);
router.route('/')
  .get(authorize('leads.read'), getLeads);

router.route('/:id')
  .put(authorize('leads.update'), updateLead);

router.post('/:id/notes', authorize('leads.update'), addLeadNote);

export default router;
