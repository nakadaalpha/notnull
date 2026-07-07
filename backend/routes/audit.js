const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { username: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to recent 100 for performance on initial load
    });
    res.json(logs);
  } catch (error) {
    console.error('Fetch Audit Logs Error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
