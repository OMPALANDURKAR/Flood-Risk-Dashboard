import app from './app.js';

const PORT = process.env.PORT || 5000;

// 🔥 Handle uncaught exceptions (sync errors)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// 🚀 Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 FloodSentry Backend running on port ${PORT}`);
});

// 🔥 Handle unhandled promise rejections (async errors)
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err.message);
  console.error(err.stack);

  server.close(() => {
    process.exit(1);
  });
});