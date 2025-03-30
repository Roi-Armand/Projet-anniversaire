import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addParticipantToEvent,
  removeParticipantFromEvent
} from '../controllers/event.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateEvent } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get event by ID
router.get('/:id', getEventById);

// Create event (admin/organizer only)
router.post('/', authenticate, authorize(['ADMIN', 'ORGANIZER']), validateEvent, createEvent);

// Update event (admin/organizer only)
router.put('/:id', authenticate, authorize(['ADMIN', 'ORGANIZER']), validateEvent, updateEvent);

// Delete event (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteEvent);

// Add participant to event
router.post('/:eventId/participants/:participantId', authenticate, authorize(['ADMIN', 'ORGANIZER']), addParticipantToEvent);

// Remove participant from event
router.delete('/:eventId/participants/:participantId', authenticate, authorize(['ADMIN', 'ORGANIZER']), removeParticipantFromEvent);

export default router;

