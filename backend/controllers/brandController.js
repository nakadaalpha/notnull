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

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl } = req.body;
  try {
    const updatedBrand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: { name, imageUrl }
    });
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { cars: true } } }
    });

    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    if (brand._count.cars > 0) {
      return res.status(400).json({ error: 'Cannot delete brand: It is associated with existing cars.' });
    }

    await prisma.brand.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };
