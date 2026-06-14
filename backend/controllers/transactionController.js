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
  const { customerId, carId, amount, totalPrice } = req.body;
  try {
    const buyAmount = parseInt(amount) || 1;
    
    // 1. Check stock
    const car = await prisma.car.findUnique({ where: { id: parseInt(carId) } });
    if (!car || car.stock < buyAmount) {
      return res.status(400).json({ error: 'Insufficient stock or car not found' });
    }

    // 2. Create transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: parseInt(customerId),
        carId: parseInt(carId),
        amount: buyAmount,
        totalPrice: parseFloat(totalPrice),
        status: 'PENDING'
      }
    });

    // 3. Update car stock
    await prisma.car.update({
      where: { id: parseInt(carId) },
      data: { stock: car.stock - buyAmount }
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

    // If transaction is CANCELLED, return stock
    if (status === 'CANCELLED') {
      const car = await prisma.car.findUnique({ where: { id: transaction.carId } });
      await prisma.car.update({
        where: { id: transaction.carId },
        data: { stock: car.stock + transaction.amount }
      });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};

module.exports = { getAllTransactions, createTransaction, updateTransactionStatus };
