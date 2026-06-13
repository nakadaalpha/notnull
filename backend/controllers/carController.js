const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        brand: true
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
      include: { brand: true }
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
  const { brandId, model, yearMade, price, status } = req.body;
  try {
    const newCar = await prisma.car.create({
      data: {
        brandId: parseInt(brandId),
        model,
        yearMade: parseInt(yearMade),
        price: parseFloat(price),
        status
      }
    });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car' });
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar
};
