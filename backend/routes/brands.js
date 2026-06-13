const express = require('express');
const router = express.Router();
const { getAllBrands, createBrand } = require('../controllers/brandController');

router.get('/', getAllBrands);
router.post('/', createBrand);

module.exports = router;
