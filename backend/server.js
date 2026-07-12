const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
// Background Sweeper (Simulating node-cron for 24h expiration)
// Runs every minute, cancels transactions that have been PENDING_PAYMENT for over 24 hours (for testing we can assume 24 minutes)
setInterval(async () => {
  try {
    const expiredTransactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING_PAYMENT',
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        }
      }
    });

    for (let trx of expiredTransactions) {
      await prisma.transaction.update({
        where: { id: trx.id },
        data: { status: 'CANCELLED' }
      });
      console.log(`[Cron] Transaction ${trx.id} cancelled due to payment expiration.`);
    }
  } catch (error) {
    console.error('Sweeper Error:', error);
  }
}, 60 * 1000); // Check every minute

const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For dev: allow frontend connection
    methods: ['GET', 'POST']
  }
});

// Middleware
const auditMiddleware = require('./middleware/auditMiddleware');
app.use(cors());
app.use(express.json());
app.use(auditMiddleware);

// Pass io to routes if needed
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a personal room based on user ID to receive direct messages
  socket.on('join', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Route / Health Check
app.get('/', async (req, res) => {
  try {
    // Check database connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'success',
      message: 'Welcome to the NOTNULL API.',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'API is currently experiencing issues.',
      timestamp: new Date().toISOString(),
      services: {
        server: 'running',
        database: 'disconnected'
      }
    });
  }
});

const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brands');
const customerRoutes = require('./routes/customers');
const transactionRoutes = require('./routes/transactions');
const messageRoutes = require('./routes/messages');
const reservationRoutes = require('./routes/reservations');
const webhooksRouter = require('./routes/webhooks');
const uploadRoutes = require('./routes/uploads');
const settingsRoutes = require('./routes/settings');
const tradeInRouter = require('./routes/tradein');
const documentRoutes = require('./routes/documents');
const auditRoutes = require('./routes/audit');
const testDrivesRoutes = require('./routes/testDrives');
const usersRoutes = require('./routes/users');

// Mount Routes
const swaggerOptions = {
  customCssUrl: '/swagger-theme.css',
  customSiteTitle: 'NOTNULL API Documentation'
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/customers', customerRoutes); // To be renamed/refactored later
app.use('/api/transactions', transactionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/uploads', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/trade-in', tradeInRouter);
app.use('/api/documents', documentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/test-drives', testDrivesRoutes);
app.use('/api/users', usersRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
