const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Simulated Xendit Webhook Endpoint
router.post('/xendit', async (req, res) => {
  // In a real scenario, Xendit sends { id, status, external_id, etc. }
  // We'll mock it by expecting { transactionId, status: 'PAID' }
  const { transactionId, status } = req.body;

  if (!transactionId || status !== 'PAID') {
    return res.status(400).json({ error: 'Invalid webhook payload or not PAID' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: parseInt(transactionId) } });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // Find a random SALES user to assign
    const salesUsers = await prisma.user.findMany({ where: { role: 'SALES' } });
    const assignedSales = salesUsers.length > 0 ? salesUsers[Math.floor(Math.random() * salesUsers.length)] : null;

    // Update Transaction to BOOKED and assign sales
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(transactionId) },
      data: { 
        status: 'BOOKED',
        salesId: assignedSales ? assignedSales.id : null
      }
    });

    // Reduce Car Stock
    await prisma.car.update({
      where: { id: transaction.carId },
      data: { stock: { decrement: 1 } }
    });

    res.json({ message: 'Webhook processed successfully, stock reduced, sales assigned.' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;
