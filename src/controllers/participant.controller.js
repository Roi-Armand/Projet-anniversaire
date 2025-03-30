import { prisma } from '../server.js';

// Get all participants
export const getAllParticipants = async (req, res, next) => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(200).json({ participants });
  } catch (error) {
    next(error);
  }
};

// Get participant by ID
export const getParticipantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participant = await prisma.participant.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        events: true
      }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.status(200).json({ participant });
  } catch (error) {
    next(error);
  }
};

// Create participant
export const createParticipant = async (req, res, next) => {
  try {
    const { userId, phone, status, notes, guests, eventIds } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if participant already exists
    const existingParticipant = await prisma.participant.findUnique({
      where: { userId }
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'Participant already exists for this user' });
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        user: { connect: { id: userId } },
        phone,
        status: status || 'PENDING',
        notes,
        guests: guests || 0,
        events: eventIds ? {
          connect: eventIds.map(id => ({ id: Number(id) }))
        } : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        events: true
      }
    });

    res.status(201).json({
      message: 'Participant created successfully',
      participant
    });
  } catch (error) {
    next(error);
  }
};

// Update participant
export const updateParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, status, notes, guests, eventIds } = req.body;

    // Check if participant exists
    const existingParticipant = await prisma.participant.findUnique({
      where: { id: Number(id) }
    });

    if (!existingParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Update participant
    const participant = await prisma.participant.update({
      where: { id: Number(id) },
      data: {
        phone,
        status,
        notes,
        guests,
        events: eventIds ? {
          set: eventIds.map(id => ({ id: Number(id) }))
        } : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        events: true
      }
    });

    res.status(200).json({
      message: 'Participant updated successfully',
      participant
    });
  } catch (error) {
    next(error);
  }
};

// Delete participant
export const deleteParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if participant exists
    const existingParticipant = await prisma.participant.findUnique({
      where: { id: Number(id) }
    });

    if (!existingParticipant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Delete participant
    await prisma.participant.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Participant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

