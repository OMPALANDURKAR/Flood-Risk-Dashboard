const app = require('./app');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions (sync errors)
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 FloodSentry Backend running on port ${PORT}`);
});

// Handle unhandled promise rejections (async errors)
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    server.close(() => {
        process.exit(1);
    });
});