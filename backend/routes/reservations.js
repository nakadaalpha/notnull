const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all reservations for a specific user (either customer or sales)
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { customerId: parseInt(userId) },
          { salesId: parseInt(userId) }
        ]
      },
      include: {
        car: { include: { brand: true } },
        customer: { select: { username: true, email: true, phone: true } },
        sales: { select: { username: true, email: true, phone: true } }
      },
      orderBy: { inspectionDate: 'asc' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Create a new reservation
router.post('/', async (req, res) => {
  const { customerId, carId, salesId, inspectionDate, fullName, email, identityNumber, notes } = req.body;
  try {
    // Save administrative data as JSON in notes
    const adminData = {
      fullName,
      email,
      identityNumber,
      userNotes: notes || ''
    };

    const newReservation = await prisma.reservation.create({
      data: {
        customerId: parseInt(customerId),
        carId: parseInt(carId),
        salesId: salesId ? parseInt(salesId) : null,
        inspectionDate: new Date(inspectionDate),
        notes: JSON.stringify(adminData),
        status: 'PENDING'
      }
    });
    
    // Simulate Xendit integration
    const mockCheckoutUrl = `https://checkout.xendit.co/web/mock-${newReservation.id}-${Date.now()}`;
    
    res.status(201).json({
      message: 'Reservation created. Redirect to checkout.',
      reservation: newReservation,
      checkout_url: mockCheckoutUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Update reservation status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
});

module.exports = router;
