const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// Get all reservations for a specific user (either customer or sales)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  
  if (req.user.role === 'CUSTOMER' && req.user.userId !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { customerId: userId },
          { salesId: userId }
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
router.post('/', authMiddleware, async (req, res) => {
  const { carId, salesId, inspectionDate, fullName, email, identityNumber, notes } = req.body;
  const customerId = req.user.userId;
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
        customerId: customerId,
        carId: parseInt(carId),
        salesId: salesId ? salesId : null,
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
router.put('/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role === 'CUSTOMER' || req.user.role === 'MECHANIC') {
    return res.status(403).json({ error: 'Access denied. Only sales/manager/admin can update status.' });
  }

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
