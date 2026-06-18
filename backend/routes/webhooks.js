const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simulated Xendit Webhook Endpoint
router.post('/xendit', async (req, res) => {
  // In a real scenario, Xendit sends { id, status, external_id, etc. }
  // We'll mock it by expecting { reservationId, status: 'PAID' }
  const { reservationId, status } = req.body;

  if (!reservationId || !status) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(reservationId) },
      data: { status: status === 'PAID' ? 'PAID' : 'PENDING' }
    });

    // We could also emit a socket.io event here to notify the frontend
    const io = req.app.get('io');
    if (io) {
      io.to(updatedReservation.customerId.toString()).emit('reservation_updated', updatedReservation);
    }

    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;
