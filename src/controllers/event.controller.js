import { prisma } from '../server.js';

// Get all events
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: {
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
        },
        organizers: {
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
        }
      }
    });

    res.status(200).json({ events });
  } catch (error) {
    next(error);
  }
};

// Get event by ID
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        participants: {
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
        },
        organizers: {
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
        }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event });
  } catch (error) {
    next(error);
  }
};

// Create event
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, startTime, endTime, location, address } = req.body;

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        address
      }
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

// Update event
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, location, address } = req.body;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        location,
        address
      }
    });

    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete event
    await prisma.event.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add participant to event
export const addParticipantToEvent = async (req, res, next) => {
  try {
    const { eventId, participantId } = req.params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: Number(participantId) }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Add participant to event
    await prisma.event.update({
      where: { id: Number(eventId) },
      data: {
        participants: {
          connect: { id: Number(participantId) }
        }
      }
    });

    res.status(200).json({ message: 'Participant added to event successfully' });
  } catch (error) {
    next(error);
  }
};

// Remove participant from event
export const removeParticipantFromEvent = async (req, res, next) => {
  try {
    const { eventId, participantId } = req.params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: Number(participantId) }
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Remove participant from event
    await prisma.event.update({
      where: { id: Number(eventId) },
      data: {
        participants: {
          disconnect: { id: Number(participantId) }
        }
      }
    });

    res.status(200).json({ message: 'Participant removed from event successfully' });
  } catch (error) {
    next(error);
  }
};

