const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createCar);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateCar);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteCar);

module.exports = router;
