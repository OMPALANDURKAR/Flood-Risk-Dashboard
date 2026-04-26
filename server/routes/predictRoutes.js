const express = require('express');
const router = express.Router();

// ✅ Controller import
const predictController = require('../controllers/predictController');

// ================================
// ✅ INFO ROUTE (for browser testing)
// ================================
router.get('/predict', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Use POST /api/predict with JSON body to get flood prediction'
  });
});

// ================================
// ✅ MAIN PREDICTION ROUTE
// ================================
router.post('/predict', predictController.predictFloodRisk);

module.exports = router;