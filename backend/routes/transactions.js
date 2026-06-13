const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, updateTransactionStatus } = require('../controllers/transactionController');

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.put('/:id/status', updateTransactionStatus);

module.exports = router;
