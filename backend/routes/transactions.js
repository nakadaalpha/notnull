const express = require('express');
const router = express.Router();
const { getAllTransactions, getUserTransactions, createTransaction, updateTransactionStatus } = require('../controllers/transactionController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES']), getAllTransactions);
router.get('/user/:userId', authMiddleware, getUserTransactions);

// Checkout Endpoint
router.post('/checkout', authMiddleware, async (req, res) => {
  const { carId, customerId, tradeInId } = req.body;
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const car = await prisma.car.findUnique({ where: { id: parseInt(carId) } });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    if (car.stock <= 0) return res.status(400).json({ error: 'Car is out of stock' });

    let finalPrice = car.price;
    let tax = car.price * 0.11; // 11% tax

    // If there is a trade-in, we wait for mechanic appraisal.
    // For now, the transaction is created but price might be adjusted later.
    // We charge $5,000 Booking Fee upfront.
    const bookingFee = 5000;

    const newTransaction = await prisma.transaction.create({
      data: {
        customerId,
        carId: parseInt(carId),
        tradeInId: tradeInId ? parseInt(tradeInId) : null,
        totalPrice: finalPrice + tax,
        bookingFee: bookingFee,
        status: 'PENDING_PAYMENT',
        invoiceUrl: `https://checkout.xendit.co/web/mock-${Date.now()}`
      }
    });

    res.json({
      message: 'Checkout initialized',
      transactionId: newTransaction.id,
      checkoutUrl: newTransaction.invoiceUrl
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

router.post('/', authMiddleware, createTransaction);
router.put('/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES']), updateTransactionStatus);

module.exports = router;
