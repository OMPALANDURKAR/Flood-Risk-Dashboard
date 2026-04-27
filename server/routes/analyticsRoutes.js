const express = require('express');
const router = express.Router();

const { getDistrictAnalytics } = require('../controllers/analyticsController');

router.get('/analytics/district', getDistrictAnalytics);

module.exports = router;