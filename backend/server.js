const express = require('express');
const cors = require('cors');
const http = require('http');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const prisma = require('./prismaClient');

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



// Middleware
const auditMiddleware = require('./middleware/auditMiddleware');
app.use(cors());
app.use(express.json());
app.use(auditMiddleware);



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
const fs = require('fs');
const path = require('path');

const swaggerCss = fs.readFileSync(path.join(__dirname, 'public', 'swagger-theme.css'), 'utf8');

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customCss: swaggerCss,
  customSiteTitle: 'NOTNULL API Documentation',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
  ]
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

// --- EMERGENCY SEED ROUTE ---
app.get('/api/run-seed', async (req, res) => {
  try {
    // 1. Fix PostgreSQL sequences in case they were desynchronized by manual GUI inserts
    try {
      await prisma.$executeRawUnsafe(`SELECT setval('"Brand_id_seq"', COALESCE((SELECT MAX(id) FROM "Brand"), 1));`);
      await prisma.$executeRawUnsafe(`SELECT setval('"Car_id_seq"', COALESCE((SELECT MAX(id) FROM "Car"), 1));`);
    } catch(err) {
      console.log('Sequence fix skipped (might not be postgres): ', err.message);
    }

    // 2. Safely find or create Brands
    let porsche = await prisma.brand.findUnique({ where: { name: 'Porsche' } });
    if (!porsche) porsche = await prisma.brand.create({ data: { name: 'Porsche', imageUrl: '/images/brands/porsche.png' } });

    let bmw = await prisma.brand.findUnique({ where: { name: 'BMW' } });
    if (!bmw) bmw = await prisma.brand.create({ data: { name: 'BMW', imageUrl: '/images/brands/bmw.png' } });

    let mercedes = await prisma.brand.findUnique({ where: { name: 'Mercedes-Benz' } });
    if (!mercedes) mercedes = await prisma.brand.create({ data: { name: 'Mercedes-Benz', imageUrl: '/images/brands/mercedes.png' } });

    // 3. Create Cars only if they don't exist
    const existingCars = await prisma.car.count();
    if (existingCars === 0) {
      await prisma.car.createMany({
        data: [
          { brandId: porsche.id, model: '911 GT3 RS', yearMade: 2024, price: 3500000000, stock: 2, imageUrl: '/images/cars/gt3rs.png', specifications: { engine: '4.0L Flat-6', power: '518 hp', transmission: '7-speed PDK' } },
          { brandId: bmw.id, model: 'M4 Competition', yearMade: 2023, price: 2100000000, stock: 3, imageUrl: '/images/cars/m4.png', specifications: { engine: '3.0L Twin-Turbo I6', power: '503 hp', transmission: '8-speed Automatic' } },
          { brandId: mercedes.id, model: 'AMG G63', yearMade: 2024, price: 4200000000, stock: 1, imageUrl: '/images/cars/g63.png', specifications: { engine: '4.0L V8 Biturbo', power: '577 hp', transmission: '9-speed Automatic' } }
        ]
      });
    }

    // 4. Create Admin
    const bcrypt = require('bcryptjs');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminExists = await prisma.user.findUnique({ where: { email: 'admin@notnull.com' } });
    if (!adminExists) {
      await prisma.user.create({ data: { id: 'admin_001', username: 'admin', email: 'admin@notnull.com', password: hashedAdminPassword, role: 'ADMIN' } });
    }

    res.status(200).json({ status: 'success', message: 'Seeding completed! Luxury collection is now live.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// ----------------------------

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
