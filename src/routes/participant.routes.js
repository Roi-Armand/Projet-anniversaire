import express from 'express';
import {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant
} from '../controllers/participant.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateParticipant } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get all participants (admin/organizer only)
router.get('/', authenticate, authorize(['ADMIN', 'ORGANIZER']), getAllParticipants);

// Get participant by ID
router.get('/:id', authenticate, getParticipantById);

// Create participant
router.post('/', authenticate, validateParticipant, createParticipant);

// Update participant
router.put('/:id', authenticate, validateParticipant, updateParticipant);

// Delete participant (admin/organizer only)
router.delete('/:id', authenticate, authorize(['ADMIN', 'ORGANIZER']), deleteParticipant);

export default router;

