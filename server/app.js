const express = require('express');
const cors = require('cors');

// ✅ FIXED: correct route import
const predictRoutes = require('./routes/predictRoutes');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FloodSentry API is running 🚀'
  });
});

// ===== MAIN ROUTES =====
// ✅ FIXED: correct base route
app.use('/api', predictRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;