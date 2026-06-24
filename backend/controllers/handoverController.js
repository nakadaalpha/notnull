const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const finalizeHandover = async (req, res) => {
  const trxId = parseInt(req.params.id);
  const { signature, checklist } = req.body;

  try {
    const trx = await prisma.transaction.findUnique({
      where: { id: trxId },
      include: {
        customer: true,
        car: {
          include: { brand: true }
        }
      }
    });

    if (!trx) return res.status(404).json({ error: 'Transaction not found' });

    // Update status to COMPLETED
    await prisma.transaction.update({
      where: { id: trxId },
      data: { status: 'COMPLETED' }
    });

    // Generate PDF Invoice
    const doc = new PDFDocument();
    const pdfDir = path.join(__dirname, '../public/uploads/invoices');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `invoice_${trxId}.pdf`);
    
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('NOTNULL - Vehicle Handover & Invoice', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Transaction ID: #${trxId}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Customer Name: ${trx.customer?.username}`);
    doc.text(`Car: ${trx.car?.brand?.name} ${trx.car?.model}`);
    doc.text(`Total Price: $${trx.totalPrice}`);
    doc.moveDown();

    doc.fontSize(16).text('Handover Checklist:');
    doc.fontSize(12).text(`[${checklist.keys ? 'X' : ' '}] Kunci Fisik (Main & Spare)`);
    doc.text(`[${checklist.bpkb ? 'X' : ' '}] BPKB`);
    doc.text(`[${checklist.stnk ? 'X' : ' '}] STNK`);
    doc.text(`[${checklist.faktur ? 'X' : ' '}] Faktur & Kwitansi`);
    doc.moveDown();

    doc.fontSize(16).text('Customer Signature:');
    if (signature) {
      const base64Data = signature.replace(/^data:image\/png;base64,/, "");
      const sigPath = path.join(pdfDir, `sig_${trxId}.png`);
      fs.writeFileSync(sigPath, base64Data, 'base64');
      
      doc.image(sigPath, { width: 200 });
    }

    doc.end();

    writeStream.on('finish', async () => {
      // Clean up signature image
      const sigPath = path.join(pdfDir, `sig_${trxId}.png`);
      if (fs.existsSync(sigPath)) fs.unlinkSync(sigPath);

      // Save PDF url to transaction if needed
      await prisma.transaction.update({
        where: { id: trxId },
        data: { invoiceUrl: `/uploads/invoices/invoice_${trxId}.pdf` }
      });

      res.json({ message: 'Handover completed and PDF generated', pdfUrl: `/uploads/invoices/invoice_${trxId}.pdf` });
    });

  } catch (error) {
    console.error('Handover Error:', error);
    res.status(500).json({ error: 'Failed to process handover' });
  }
};

module.exports = { finalizeHandover };
