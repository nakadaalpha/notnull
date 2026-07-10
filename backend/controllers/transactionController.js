const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const { assignToSalesRep } = require('../utils/assignment');
const { Xendit } = require('xendit-node');

let xenditClient;
try {
  xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY || 'dummy_key' });
} catch (err) {
  console.warn('Xendit init failed, using mock mode.');
}

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        customer: true,
        car: { include: { brand: true } },
        sales: { select: { username: true } }
      }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getUserTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await prisma.transaction.findMany({
      where: { customerId: userId },
      include: {
        car: { include: { brand: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user transactions' });
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

    // 2. Determine Sales Assignment
    const autoAssignedSalesId = await assignToSalesRep(prisma);

    // 3. Create transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: customerId,
        carId: parseInt(carId),
        salesId: autoAssignedSalesId,
        amount: buyAmount,
        totalPrice: parseFloat(totalPrice),
        status: 'PENDING'
      }
    });

    // 4. Update car stock
    await prisma.car.update({
      where: { id: parseInt(carId) },
      data: { stock: car.stock - buyAmount }
    });

    // 5. Generate Xendit Invoice
    let checkoutUrl = `/mock-payment/${newTransaction.id}`;
    
    try {
      if (xenditClient && xenditClient.Invoice) {
        // Find customer details for invoice
        const customer = await prisma.user.findUnique({ where: { id: customerId } });
        
        const invoiceData = {
          externalId: `invoice-${newTransaction.id}-${Date.now()}`,
          amount: parseFloat(totalPrice),
          payerEmail: customer.email || 'customer@example.com',
          description: `Payment for ${car.brand?.name || ''} ${car.model}`,
          successRedirectUrl: 'http://localhost:5173/payment-success',
          failureRedirectUrl: 'http://localhost:5173/checkout',
          currency: 'IDR'
        };

        const invoice = await xenditClient.Invoice.createInvoice({ data: invoiceData });
        if (invoice && invoice.invoiceUrl) {
          checkoutUrl = invoice.invoiceUrl;
        }
      }
    } catch (xenditError) {
      console.error('Xendit Error (fallback to mock):', xenditError.message);
    }

    res.status(201).json({
      message: 'Transaction created. Redirect to checkout.',
      transaction: newTransaction,
      checkout_url: checkoutUrl
    });
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

const updateTransactionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Enforce RBAC rules for transaction completion
  if (status === 'COMPLETED' && req.user.role === 'SALES') {
    return res.status(403).json({ error: 'Forbidden: Only MANAGER or ADMIN can mark transactions as COMPLETED.' });
  }

  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { customer: true, car: true }
    });

    // Simulate Digital PDF Invoice and Email upon COMPLETED
    if (status === 'COMPLETED') {
      const invoiceContent = `
        <html>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1>DIGITAL INVOICE</h1>
          <p>Transaction ID: ${transaction.id}</p>
          <p>Customer: ${transaction.customer.username} (${transaction.customer.email})</p>
          <p>Vehicle: ${transaction.car.model}</p>
          <p>Total Paid: $${transaction.totalPrice.toLocaleString()}</p>
          <h2>PAID IN FULL</h2>
          <p>Thank you for choosing NotNull Premium Motors.</p>
        </body>
        </html>
      `;
      const invoicePath = path.join(__dirname, '..', 'public', `invoice_${transaction.id}.html`);
      fs.writeFileSync(invoicePath, invoiceContent);
      console.log(`[Email System Mock] Sent Digital Invoice to ${transaction.customer.email} (File: ${invoicePath})`);
    }

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

const cancelUserTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
    if (!transaction || transaction.customerId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    if (transaction.status !== 'CANCELLED') {
      const car = await prisma.car.findUnique({ where: { id: transaction.carId } });
      await prisma.car.update({
        where: { id: transaction.carId },
        data: { stock: car.stock + transaction.amount }
      });
      
      const updated = await prisma.transaction.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELLED' }
      });
      return res.json(updated);
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel transaction' });
  }
};

module.exports = { getAllTransactions, getUserTransactions, createTransaction, updateTransactionStatus, cancelUserTransaction };
