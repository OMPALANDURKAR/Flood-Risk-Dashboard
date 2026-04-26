const express = require('express');
const router = express.Router();

const { getAllData } = require('../controllers/dataController');

router.get('/data', getAllData);

module.exports = router;