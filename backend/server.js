const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Serve static files (like custom swagger CSS)
app.use(express.static('public'));

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For dev: allow frontend connection
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the PERN Stack API!' });
});

const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brands');
const customerRoutes = require('./routes/customers');
const transactionRoutes = require('./routes/transactions');
const messageRoutes = require('./routes/messages');
const reservationRoutes = require('./routes/reservations');
const webhookRoutes = require('./routes/webhooks');

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
app.use('/api/webhooks', webhookRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
