const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Xendit Webhook Receiver
router.post('/xendit', async (req, res) => {
  try {
    const webhookEvent = req.body;
    
    // According to Xendit Invoice webhook structure:
    // webhookEvent.external_id (e.g., invoice-12-169...)
    // webhookEvent.status ('PAID', 'EXPIRED', 'SETTLED', etc)
    const { external_id, status } = webhookEvent;

    console.log(`[Xendit Webhook] Received event for ${external_id} with status ${status}`);

    if (external_id && external_id.startsWith('invoice-')) {
      const transactionId = parseInt(external_id.split('-')[1]);

      if (status === 'PAID' || status === 'SETTLED') {
        // Update transaction to BOOKED since they only paid the booking fee
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'BOOKED' }
        });
        console.log(`[Xendit Webhook] Transaction ${transactionId} marked as BOOKED`);
      } else if (status === 'EXPIRED') {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'CANCELLED' }
        });
        console.log(`[Xendit Webhook] Transaction ${transactionId} marked as CANCELLED`);
      }
    }

    // Always return 200 OK to acknowledge receipt
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Xendit Webhook] Error processing webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
