const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for private KYC uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/private/users/sim');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'sim-' + req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Upload KYC (SIM)
router.post('/kyc/sim', authMiddleware, upload.single('simFile'), async (req, res) => {
  try {
    const { simNumber, simExpiry } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!simNumber || !simExpiry) {
      return res.status(400).json({ error: 'SIM Number and Expiry Date are required' });
    }

    const relativePath = `/uploads/private/users/sim/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        sim_number: simNumber,
        sim_expiry_date: new Date(simExpiry),
        sim_file_path: relativePath,
        is_sim_verified: false // Will be verified by Sales
      },
      select: {
        id: true,
        username: true,
        is_sim_verified: true,
        sim_number: true,
        sim_expiry_date: true
      }
    });

    res.json({ message: 'KYC documents submitted successfully', user: updatedUser });
  } catch (error) {
    console.error('KYC Upload error:', error);
    res.status(500).json({ error: 'Failed to process KYC upload' });
  }
});

// Stream KYC Image (Protected)
router.get('/kyc/sim/image/:userId', authMiddleware, async (req, res) => {
  try {
    // Only SALES, ADMIN, or the owner can view this image
    if (req.user.role !== 'SALES' && req.user.role !== 'ADMIN' && req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Unauthorized to view this document' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: req.params.userId }
    });

    if (!targetUser || !targetUser.sim_file_path) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const absolutePath = path.join(__dirname, '..', targetUser.sim_file_path);
    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);
    } else {
      res.status(404).json({ error: 'File not found on disk' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve document' });
  }
});

// Get Current User Profile (including KYC status)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        is_sim_verified: true,
        sim_number: true,
        sim_expiry_date: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
