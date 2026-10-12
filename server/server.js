import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import tableRoutes from './routes/tables.js';
import bookingRoutes from './routes/bookings.js';
import menuRoutes from './routes/menu.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// ===== MIDDLEWARE =====

app.use(
  cors({
    origin: true,        // allow all origins (echoes back the request origin)
    methods: "*",        // allow all HTTP methods
    credentials: true,   // allow cookies/auth headers
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// ===== ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Restaurant Booking Server is Running!',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);

// ===== ERROR HANDLERS =====

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===== SERVER STARTUP =====

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║  🍽️  Restaurant Booking Server       ║
╠═══════════════════════════════════════╣
║  ✅ Server running on port ${PORT}        
║  ✅ Environment: ${process.env.NODE_ENV || 'development'}
║  ✅ API: http://localhost:${PORT}/api
╚═══════════════════════════════════════╝
  `);
});