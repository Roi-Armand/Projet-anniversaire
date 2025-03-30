import { prisma } from '../server.js';

// Get all organizers
export const getAllOrganizers = async (req, res, next) => {
  try {
    const organizers = await prisma.organizer.findMany({
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

    res.status(200).json({ organizers });
  } catch (error) {
    next(error);
  }
};

// Get organizer by ID
export const getOrganizerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organizer = await prisma.organizer.findUnique({
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

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.status(200).json({ organizer });
  } catch (error) {
    next(error);
  }
};

// Create organizer
export const createOrganizer = async (req, res, next) => {
  try {
    const { userId, phone, position, eventIds } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if organizer already exists
    const existingOrganizer = await prisma.organizer.findUnique({
      where: { userId }
    });

    if (existingOrganizer) {
      return res.status(400).json({ message: 'Organizer already exists for this user' });
    }

    // Update user role to ORGANIZER
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ORGANIZER' }
    });

    // Create organizer
    const organizer = await prisma.organizer.create({
      data: {
        user: { connect: { id: userId } },
        phone,
        position,
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
            lastName: true,
            role: true
          }
        },
        events: true
      }
    });

    res.status(201).json({
      message: 'Organizer created successfully',
      organizer
    });
  } catch (error) {
    next(error);
  }
};

// Update organizer
export const updateOrganizer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, position, eventIds } = req.body;

    // Check if organizer exists
    const existingOrganizer = await prisma.organizer.findUnique({
      where: { id: Number(id) }
    });

    if (!existingOrganizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Update organizer
    const organizer = await prisma.organizer.update({
      where: { id: Number(id) },
      data: {
        phone,
        position,
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
      message: 'Organizer updated successfully',
      organizer
    });
  } catch (error) {
    next(error);
  }
};

// Delete organizer
export const deleteOrganizer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if organizer exists
    const existingOrganizer = await prisma.organizer.findUnique({
      where: { id: Number(id) }
    });

    if (!existingOrganizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Update user role back to USER
    await prisma.user.update({
      where: { id: existingOrganizer.userId },
      data: { role: 'USER' }
    });

    // Delete organizer
    await prisma.organizer.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Organizer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add organizer to event
export const addOrganizerToEvent = async (req, res, next) => {
  try {
    const { eventId, organizerId } = req.params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if organizer exists
    const organizer = await prisma.organizer.findUnique({
      where: { id: Number(organizerId) }
    });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Add organizer to event
    await prisma.event.update({
      where: { id: Number(eventId) },
      data: {
        organizers: {
          connect: { id: Number(organizerId) }
        }
      }
    });

    res.status(200).json({ message: 'Organizer added to event successfully' });
  } catch (error) {
    next(error);
  }
};

