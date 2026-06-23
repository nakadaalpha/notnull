const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/:key', settingsController.getSetting);
router.put('/:key', authMiddleware, roleMiddleware('ADMIN'), settingsController.upsertSetting);

module.exports = router;
