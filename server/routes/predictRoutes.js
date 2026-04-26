const express = require('express');
const router = express.Router();

// ✅ Correct controller import
const predictController = require('../controllers/predictController');

// ================================
// POST /api/predict
// ================================
router.post('/predict', predictController.predictFloodRisk);

module.exports = router;