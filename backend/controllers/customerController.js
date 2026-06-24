const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const generateId = require('../utils/generateId');
const prisma = new PrismaClient();

const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      include: {
        _count: {
          select: { transactions: true, reservationsAsCust: true }
        }
      }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.user.findFirst({
      where: { id: req.params.id, role: 'CUSTOMER' },
      include: { transactions: true, reservationsAsCust: true }
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

const createCustomer = async (req, res) => {
  const { username, password, email, phone, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await prisma.user.create({
      data: { id: generateId(), username, password: hashedPassword, email, phone, address, role: 'CUSTOMER' }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

const updateCustomerRole = async (req, res) => {
  const { role } = req.body;
  if (!['CUSTOMER', 'SALES', 'MANAGER', 'MECHANIC', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { username, email, phone, address, password } = req.body;
  try {
    const updateData = { username, email, phone, address };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: updateData
    });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { transactions: true, reservationsAsCust: true, reservationsAsSales: true } }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user._count.transactions > 0 || user._count.reservationsAsCust > 0 || user._count.reservationsAsSales > 0) {
      return res.status(400).json({ error: 'Cannot delete user: They have existing transactions or reservations.' });
    }

    await prisma.$transaction([
      prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } }),
      prisma.user.delete({ where: { id } })
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomerRole, updateCustomer, deleteCustomer };
