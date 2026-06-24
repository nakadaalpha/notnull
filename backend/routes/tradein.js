const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { createTradeIn, getAllTradeIns, updateTradeInStatus, getAvailability, scheduleInspection, getMyTradeIns, cancelUserTradeIn } = require('../controllers/tradeInController');

// Create Trade-In (Customer)
router.post('/', authMiddleware, createTradeIn);

// Get all Trade-Ins (Internal)
router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES', 'MECHANIC']), getAllTradeIns);

// Update Status (Internal specific)
router.put('/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES', 'MECHANIC']), updateTradeInStatus);
// Get availability
router.get('/availability', authMiddleware, getAvailability);

// Get my trade-ins
router.get('/me', authMiddleware, getMyTradeIns);

// Customer requests schedule
router.put('/:id/schedule', authMiddleware, scheduleInspection);

// Customer cancels trade-in
router.put('/:id/cancel', authMiddleware, cancelUserTradeIn);

module.exports = router;
