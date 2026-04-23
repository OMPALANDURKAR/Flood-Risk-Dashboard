const express = require('express');
const router = express.Router();
const floodController = require('../controller/floodController');

router.get('/flood-data', floodController.getFloodData);
router.get('/analytics', floodController.getDashboardAnalytics);

module.exports = router;