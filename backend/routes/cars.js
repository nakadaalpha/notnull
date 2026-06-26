const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, createCar, updateCar, deleteCar, getCarRecommendations } = require('../controllers/carController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.get('/:id/recommendations', getCarRecommendations);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createCar);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateCar);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteCar);

module.exports = router;
