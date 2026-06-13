const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        customer: true,
        car: { include: { brand: true } }
      }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const createTransaction = async (req, res) => {
  const { customerId, carId, type, totalPrice, startDate, endDate } = req.body;
  try {
    // 1. Create transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: parseInt(customerId),
        carId: parseInt(carId),
        type, // RENT or BUY
        totalPrice: parseFloat(totalPrice),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'PENDING'
      }
    });

    // 2. Update car status (if rented or bought, it's no longer AVAILABLE)
    const newStatus = type === 'RENT' ? 'RENTED' : 'SOLD';
    await prisma.car.update({
      where: { id: parseInt(carId) },
      data: { status: newStatus }
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

const updateTransactionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // If transaction is COMPLETED and it was a RENT, the car becomes AVAILABLE again
    if (status === 'COMPLETED' && transaction.type === 'RENT') {
      await prisma.car.update({
        where: { id: transaction.carId },
        data: { status: 'AVAILABLE' }
      });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};

module.exports = { getAllTransactions, createTransaction, updateTransactionStatus };
