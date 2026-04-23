const express = require('express');
const cors = require('cors');
const floodRoutes = require('./routes/floodRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', floodRoutes);

module.exports = app;