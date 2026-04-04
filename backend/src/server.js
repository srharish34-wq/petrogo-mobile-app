/**
 * PetroGo Backend Server
 * Emergency Fuel Delivery API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);



// ✅ CORS — allow ALL origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-phone', 'Authorization'],
  credentials: false
}));

// ✅ Preflight
app.options('*', cors());

// ✅ Socket.io
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('leave_order', (orderId) => {
    socket.leave(`order_${orderId}`);
  });

  socket.on('partner_location_update', (data) => {
    if (data.orderId && data.location) {
      io.to(`order_${data.orderId}`).emit('partner_location', data);
    }
  });

  socket.on('order_status_update', (data) => {
    if (data.orderId) {
      io.to(`order_${data.orderId}`).emit('order_update', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚗 PetroGo API is running!',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api/v1', (req, res) => {
  res.status(200).json({ status: 'success', message: '🚗 Welcome to PetroGo API' });
});

// ============================================================
// LOAD ALL ROUTES (with error catching so one bad file doesn't crash everything)
// ============================================================
try { app.use('/api/v1/auth', require('./routes/auth')); console.log('✅ Auth routes'); } catch(e) { console.error('❌ Auth routes:', e.message); }
try { app.use('/api/v1/orders', require('./routes/orders')); console.log('✅ Order routes'); } catch(e) { console.error('❌ Order routes:', e.message); }
try { app.use('/api/v1/payments', require('./routes/payments')); console.log('✅ Payment routes'); } catch(e) { console.error('❌ Payment routes:', e.message); }
try { app.use('/api/v1/bunks', require('./routes/bunks')); console.log('✅ Bunk routes'); } catch(e) { console.error('❌ Bunk routes:', e.message); }
try { app.use('/api/v1/partners', require('./routes/partners')); console.log('✅ Partner routes'); } catch(e) { console.error('❌ Partner routes:', e.message); }
try { app.use('/api/v1/admin', require('./routes/admin')); console.log('✅ Admin routes'); } catch(e) { console.error('❌ Admin routes:', e.message); }

// ============================================================
// 404 & ERROR HANDLER
// ============================================================
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal server error' });
});

// ============================================================
// START
// ============================================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('==================================================');
    console.log('🚀 Starting PetroGo Server...');
    console.log('==================================================');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    server.listen(PORT, () => {
      console.log('==================================================');
      console.log('✅ Server is running!');
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔍 Health: http://localhost:${PORT}/health`);
      console.log(`🔌 Socket.io: Enabled`);
      console.log('==================================================');
    });
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
module.exports = { app, server, io };