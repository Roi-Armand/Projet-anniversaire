import express from 'express';
import {
  getAllOrganizers,
  getOrganizerById,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
  addOrganizerToEvent
} from '../controllers/organizer.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateOrganizer } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get all organizers
router.get('/', authenticate, getAllOrganizers);

// Get organizer by ID
router.get('/:id', authenticate, getOrganizerById);

// Create organizer (admin only)
router.post('/', authenticate, authorize(['ADMIN']), validateOrganizer, createOrganizer);

// Update organizer (admin only)
router.put('/:id', authenticate, authorize(['ADMIN']), validateOrganizer, updateOrganizer);

// Delete organizer (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteOrganizer);

// Add organizer to event (admin only)
router.post('/:organizerId/events/:eventId', authenticate, authorize(['ADMIN']), addOrganizerToEvent);

export default router;

