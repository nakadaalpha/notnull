const express = require('express');
const router = express.Router();
const { getAllCars, getCarById, createCar } = require('../controllers/carController');

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', createCar);

module.exports = router;
