const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const prisma = new PrismaClient();

// Konfigurasi Multer untuk Direktori Privat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/private/documents');
    // Ensure dir exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// 1. Endpoint Unggah Dokumen (Hanya ADMIN dan MECHANIC)
router.post('/upload', authMiddleware, roleMiddleware(['ADMIN', 'MECHANIC']), upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const filePaths = req.files.map(file => file.filename);
    res.json({ message: 'Files uploaded successfully', files: filePaths });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload files.' });
  }
});

// 2. Endpoint Akses/Lihat Dokumen (Hanya ADMIN dan MANAGER)
router.get('/view/:filename', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/private/documents', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found.' });
    }

    // Mengirim file fisik langsung ke client/browser untuk streaming (res.sendFile)
    res.sendFile(filePath);
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
