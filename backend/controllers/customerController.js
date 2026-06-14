const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.user.findFirst({
      where: { id: parseInt(req.params.id), role: 'CUSTOMER' },
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
    const newCustomer = await prisma.user.create({
      data: { username, password, email, phone, address, role: 'CUSTOMER' }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer };
