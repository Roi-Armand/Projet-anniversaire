import { body, validationResult } from 'express-validator';

// Validate request
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate registration
export const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  validateRequest
];

// Validate login
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

// Validate participant
export const validateParticipant = [
  body('userId').isInt().withMessage('User ID must be an integer'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('status').optional().isIn(['PENDING', 'CONFIRMED', 'DECLINED']).withMessage('Invalid status'),
  body('guests').optional().isInt({ min: 0 }).withMessage('Guests must be a positive integer'),
  validateRequest
];

// Validate event
export const validateEvent = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in format HH:MM'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in format HH:MM'),
  body('location').notEmpty().withMessage('Location is required'),
  body('address').notEmpty().withMessage('Address is required'),
  validateRequest
];

// Validate organizer
export const validateOrganizer = [
  body('userId').isInt().withMessage('User ID must be an integer'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('position').optional().notEmpty().withMessage('Position cannot be empty if provided'),
  validateRequest
];

