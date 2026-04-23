const express = require('express');
const cors = require('cors');
const floodRoutes = require('./routes/floodRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (very useful for deployment)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'FloodSentry API is running' });
});

// Routes
app.use('/api/floods', floodRoutes);

// 404 Handler (IMPORTANT)
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler (IMPORTANT)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
    });
});

module.exports = app;