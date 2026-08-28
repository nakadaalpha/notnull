const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const prisma = new PrismaClient();

// Konfigurasi Multer untuk Cloudinary (Dokumen)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notnull/documents',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
  },
});
const upload = multer({ storage });

// 1. Endpoint Unggah Dokumen (Hanya ADMIN dan MECHANIC)
router.post('/upload', authMiddleware, roleMiddleware(['ADMIN', 'MECHANIC']), upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    // filename here is the Cloudinary public_id
    const filePaths = req.files.map(file => file.filename);
    res.json({ message: 'Files uploaded successfully', files: filePaths });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload files.' });
  }
});

// 2. Endpoint Akses/Lihat Dokumen (Hanya ADMIN dan MANAGER)
router.get('/view/:filename(*)', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), (req, res) => {
  try {
    const filename = req.params.filename;
    // Generate secure URL directly from Cloudinary using the public_id (filename)
    const url = cloudinary.url(filename, { secure: true });
    
    // Redirect browser to the Cloudinary URL
    res.redirect(url);
  } catch (error) {
    console.error('View Document Error:', error);
    res.status(500).json({ error: 'Failed to retrieve file.' });
  }
});

// 3. Endpoint Simpan/Update Kelengkapan Dokumen Mobil (Hanya ADMIN dan MECHANIC)
router.post('/:carId', authMiddleware, roleMiddleware(['ADMIN', 'MECHANIC']), async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const { licensePlate, vin, has_bpkb, has_stnk, stnk_expiry_date, has_faktur, has_kwitansi_blanko, has_form_a, scanned_files } = req.body;

    const document = await prisma.carDocument.upsert({
      where: { carId },
      update: {
        licensePlate: licensePlate || null,
        vin: vin || null,
        has_bpkb: has_bpkb || false,
        has_stnk: has_stnk || false,
        stnk_expiry_date: stnk_expiry_date ? new Date(stnk_expiry_date) : null,
        has_faktur: has_faktur || false,
        has_kwitansi_blanko: has_kwitansi_blanko || false,
        has_form_a: has_form_a || false,
        scanned_files: scanned_files || {},
      },
      create: {
        carId,
        licensePlate: licensePlate || null,
        vin: vin || null,
        has_bpkb: has_bpkb || false,
        has_stnk: has_stnk || false,
        stnk_expiry_date: stnk_expiry_date ? new Date(stnk_expiry_date) : null,
        has_faktur: has_faktur || false,
        has_kwitansi_blanko: has_kwitansi_blanko || false,
        has_form_a: has_form_a || false,
        scanned_files: scanned_files || {},
      }
    });

    res.json({ message: 'Document data saved successfully', document });
  } catch (error) {
    console.error('Save Document Error:', error);
    res.status(500).json({ error: 'Failed to save document data.' });
  }
});

module.exports = router;
