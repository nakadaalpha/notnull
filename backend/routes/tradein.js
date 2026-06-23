const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createTradeIn, getAllTradeIns, updateTradeInStatus } = require('../controllers/tradeInController');

// Create Trade-In (Customer)
router.post('/', authMiddleware, createTradeIn);

// Get all Trade-Ins (Internal)
router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES', 'MECHANIC']), getAllTradeIns);

// Update Status (Internal specific)
router.put('/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES', 'MECHANIC']), updateTradeInStatus);

module.exports = router;
