const express = require('express');
const router = express.Router();
const { getAllBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', getAllBrands);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createBrand);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateBrand);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteBrand);

module.exports = router;
