const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerById, createCustomer, updateCustomerRole, updateCustomer, deleteCustomer } = require('../controllers/customerController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'SALES']), getAllCustomers);
router.get('/:id', authMiddleware, getCustomerById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SALES']), createCustomer);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SALES']), updateCustomer);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteCustomer);
router.put('/:id/role', authMiddleware, roleMiddleware(['ADMIN']), updateCustomerRole);

module.exports = router;
