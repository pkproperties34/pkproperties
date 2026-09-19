import express from 'express';
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('properties.create'), createProperty);

router.route('/:id')
  .put(protect, authorize('properties.update'), updateProperty)
  .delete(protect, authorize('properties.delete'), deleteProperty);

router.get('/details/:slug', getPropertyBySlug);

export default router;
