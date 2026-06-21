const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, updateTransactionStatus } = require('../controllers/transactionController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'SALES']), getAllTransactions);
router.post('/', authMiddleware, createTransaction);
router.put('/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'SALES']), updateTransactionStatus);

module.exports = router;
