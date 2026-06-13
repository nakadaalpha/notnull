const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { cars: true }
    });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

const createBrand = async (req, res) => {
  const { name } = req.body;
  try {
    const newBrand = await prisma.brand.create({
      data: { name }
    });
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

module.exports = { getAllBrands, createBrand };
