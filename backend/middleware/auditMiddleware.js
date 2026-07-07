const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auditMiddleware = (req, res, next) => {
  // Only intercept mutating methods
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    // We must wait for the response to finish
    res.on('finish', async () => {
      // Only log if we know who did it. req.user should be populated by authMiddleware.
      if (req.user && (req.user.id || req.user.userId)) {
        let sanitizedBody = { ...req.body };
        // Mask sensitive fields
        if (sanitizedBody.password) sanitizedBody.password = '***MASKED***';
        if (sanitizedBody.oldPassword) sanitizedBody.oldPassword = '***MASKED***';
        if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***MASKED***';

        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user.id || req.user.userId,
              action: `${req.method} ${req.originalUrl}`,
              resource: req.originalUrl,
              ipAddress: req.ip || req.connection?.remoteAddress,
              payload: Object.keys(sanitizedBody).length ? sanitizedBody : null
            }
          });
        } catch (error) {
          console.error('[Audit Error] Failed to write audit log:', error);
        }
      }
    });
  }
  next();
};

module.exports = auditMiddleware;
