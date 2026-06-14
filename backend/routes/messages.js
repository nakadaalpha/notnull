const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get conversation between two users
router.get('/:userId/:peerId', async (req, res) => {
  const { userId, peerId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId), receiverId: parseInt(peerId) },
          { senderId: parseInt(peerId), receiverId: parseInt(userId) }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        content
      }
    });

    // Emit event via socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('new_message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get available sales representatives
router.get('/sales/agents', async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'SALES' },
      select: { id: true, username: true, email: true, phone: true }
    });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales agents' });
  }
});

module.exports = router;
