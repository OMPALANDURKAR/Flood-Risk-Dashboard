const express = require('express');
const router = express.Router();

const { predictFlood } = require('../controllers/predictController');
const validateInput = require('../middleware/validateInput');

// GET
router.get('/predict', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Use POST /api/predict with JSON body to get flood prediction'
  });
});

// POST with validation
router.post('/predict', validateInput, predictFlood);

module.exports = router;