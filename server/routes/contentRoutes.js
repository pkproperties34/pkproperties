import express from 'express';
import { getSiteContent, updateSiteContent, getDeveloperSettings } from '../controllers/contentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSiteContent)
  .put(protect, admin, updateSiteContent);

router.get('/developer-settings', protect, admin, getDeveloperSettings);

export default router;
