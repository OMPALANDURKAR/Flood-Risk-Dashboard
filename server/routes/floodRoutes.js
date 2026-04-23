const express = require('express');
const router = express.Router();
const floodController = require('../controller/floodController');

// GET all flood data
router.get('/', floodController.getFloodData);

// GET analytics data
router.get('/analytics', floodController.getDashboardAnalytics);

module.exports = router;