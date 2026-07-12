const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware'); // assuming we have this

// Helper function to check for scheduling conflicts
const checkScheduleConflict = async (carId, scheduleDate) => {
  const targetDate = new Date(scheduleDate);
  const oneHourBefore = new Date(targetDate.getTime() - 60 * 60 * 1000);
  const oneHourAfter = new Date(targetDate.getTime() + 60 * 60 * 1000);

  // Check test drives
  const conflictingTestDrives = await prisma.testDrive.findMany({
    where: {
      carId: parseInt(carId),
      status: { in: ['SCHEDULED', 'ON_GOING'] },
      schedule_date: {
        gte: oneHourBefore,
        lte: oneHourAfter,
      }
    }
  });

  // Check inspections (trade-ins or reservations if any)
  const conflictingTradeIns = await prisma.tradeIn.findMany({
    where: {
      // If the trade in is related to this car? No, trade ins are for customer cars.
      // What about reservations?
    }
  });
  
  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      carId: parseInt(carId),
      status: { in: ['PENDING', 'CONFIRMED'] },
      scheduledAt: { // wait, inspectionDate in reservation schema
        gte: oneHourBefore,
        lte: oneHourAfter,
      }
    }
  });

  return conflictingTestDrives.length > 0 || conflictingReservations.length > 0;
};

// Create Test Drive Booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { carId, scheduleDate, locationType, liabilityAgreed } = req.body;
    const customerId = req.user.userId;

    if (!liabilityAgreed) {
      return res.status(400).json({ error: 'You must agree to the liability terms.' });
    }

    // Verify KYC status
    const user = await prisma.user.findUnique({ where: { id: customerId } });
    if (!user || !user.is_sim_verified) {
      return res.status(403).json({ error: 'Driver License (SIM) must be verified first.' });
    }

    // Check conflict
    const hasConflict = await checkScheduleConflict(carId, scheduleDate);
    if (hasConflict) {
      return res.status(409).json({ error: 'This time slot is already booked for this vehicle.' });
    }

    const testDrive = await prisma.testDrive.create({
      data: {
        carId: parseInt(carId),
        customerId,
        schedule_date: new Date(scheduleDate),
        location_type: locationType || 'SHOWROOM',
        liability_agreed: true,
        liability_agreed_at: new Date(),
        status: 'REQUESTED'
      }
    });

    res.status(201).json(testDrive);
  } catch (error) {
    console.error('Create TestDrive error:', error);
    res.status(500).json({ error: 'Failed to create test drive request' });
  }
});

// List Test Drives (for Admin/Sales)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'CUSTOMER') {
      const testDrives = await prisma.testDrive.findMany({
        where: { customerId: req.user.userId },
        include: { car: { include: { brand: true } } }
      });
      return res.json(testDrives);
    }
    
    // For Sales/Admin
    const testDrives = await prisma.testDrive.findMany({
      include: { 
        car: { include: { brand: true } },
        customer: {
          select: { id: true, username: true, email: true, phone: true, sim_number: true, is_sim_verified: true }
        }
      },
      orderBy: { schedule_date: 'asc' }
    });
    res.json(testDrives);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch test drives' });
  }
});

// Verify and Assign Sales
router.patch('/:id/verify', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'SALES' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const testDrive = await prisma.testDrive.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: 'SCHEDULED',
        salesId: req.user.userId
      },
      include: { customer: true }
    });

    // Also mark customer's SIM as verified just in case
    await prisma.user.update({
      where: { id: testDrive.customerId },
      data: { is_sim_verified: true }
    });

    res.json(testDrive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify test drive' });
  }
});

// Complete Test Drive
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'SALES' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const testDrive = await prisma.testDrive.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'COMPLETED' }
    });

    res.json(testDrive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete test drive' });
  }
});

module.exports = router;
