const express = require('express');
const cors = require('cors');

const predictRoutes = require('./routes/predictRoutes');
const dataRoutes = require('./routes/dataRoutes'); // ✅ ADDED
const { logError } = require('./utils/errorLogger');

const fs = require('fs');
const path = require('path');

const app = express();

// =======================
// GLOBAL MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// REQUEST + RESPONSE LOGGER
// =======================
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms\n`;

    console.log(`➡️ ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);

    const logFilePath = path.join(__dirname, './logs/requests.log');

    fs.appendFile(logFilePath, log, (err) => {
      if (err) console.error('Log write error:', err);
    });
  });

  next();
});

// =======================
// ROOT ROUTE
// =======================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running'
  });
});

// =======================
// HEALTH CHECK
// =======================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FloodSentry API is running 🚀'
  });
});

// =======================
// ROUTES
// =======================
app.use('/api', predictRoutes);
app.use('/api', dataRoutes); // ✅ ADDED

// =======================
// 404 HANDLER (LAST)
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);

  logError(err, req);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;