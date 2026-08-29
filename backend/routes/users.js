const express = require('express');
const router = express.Router();
const multer = require('multer');

const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/authMiddleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure multer for private KYC uploads via Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notnull/kyc',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

    // Cloudinary stores the full secure URL in req.file.path
    const cloudinaryUrl = req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        sim_number: simNumber,
        sim_expiry_date: new Date(simExpiry),
        sim_file_path: cloudinaryUrl,
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

    // Since sim_file_path is now a Cloudinary URL, we can redirect to it
    res.redirect(targetUser.sim_file_path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve file' });
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
