const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        brand: true,
        document: true
      }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// Get single car
const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { brand: true, document: true }
    });
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

// Create a car
const createCar = async (req, res) => {
  const { brandId, model, yearMade, price, imageUrl, stock, specifications } = req.body;
  try {
    const newCar = await prisma.car.create({
      data: {
        brandId: parseInt(brandId),
        model,
        yearMade: parseInt(yearMade),
        price: parseFloat(price),
        imageUrl,
        specifications,
        stock: parseInt(stock || 1)
      }
    });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car' });
  }
};

const updateCar = async (req, res) => {
  const { id } = req.params;
  const { brandId, model, yearMade, price, stock, imageUrl, specifications } = req.body;
  try {
    const updatedCar = await prisma.car.update({
      where: { id: parseInt(id) },
      data: {
        brandId: brandId ? parseInt(brandId) : undefined,
        model,
        yearMade: yearMade ? parseInt(yearMade) : undefined,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        imageUrl,
        specifications
      }
    });
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { transactions: true, reservations: true } } }
    });

    if (!car) return res.status(404).json({ error: 'Car not found' });
    if (car._count.transactions > 0 || car._count.reservations > 0) {
      return res.status(400).json({ error: 'Cannot delete car: It has existing transactions or reservations.' });
    }

    await prisma.car.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
