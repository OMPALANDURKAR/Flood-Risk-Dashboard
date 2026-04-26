const express = require('express');
const cors = require('cors');

const predictRoutes = require('./routes/predictRoutes');

const app = express();

// =======================
// GLOBAL MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// REQUEST LOGGER (DEBUG)
// =======================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
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
// FINAL ROUTE → /api/predict
app.use('/api', predictRoutes);

// =======================
// 404 HANDLER
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
  console.error('❌ ERROR STACK:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;