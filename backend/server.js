// Main Backend Server for HERE Student Support Platform
// ServiceNow Student Challenge Track 4: Self-Service Support Portal

import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDb } from '../database/db.js';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import safetyRoutes from './routes/safety.js';
import mlRoutes from './routes/ml.js';
import caseRoutes from './routes/cases.js';
import appointmentRoutes from './routes/appointments.js';
import waitlistRoutes from './routes/waitlist.js';
import resourceRoutes from './routes/resources.js';
import counsellorRoutes from './routes/counsellor.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Initialize Persistent Database
initDb();

// Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.includes('/health')) {
      console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'HERE Student Wellbeing Support Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/counsellor', counsellorRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 HERE Backend API Server running on port ${PORT}`);
  console.log(`🌐 API Endpoints: http://localhost:${PORT}/api/health`);
  console.log(`🧠 ML Model Layer: Scikit-Learn TF-IDF Pipeline`);
  console.log('====================================================');
});
