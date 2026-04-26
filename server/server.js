import app from './app.js';

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

/**
 * 🔥 Handle uncaught exceptions (sync errors)
 */
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION!');
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  process.exit(1);
});

/**
 * 🚀 Start Server
 */
const server = app.listen(PORT, () => {
  console.log('\n==============================');
  console.log('🚀 FloodSentry Backend Started');
  console.log('==============================');
  console.log(`🌐 Environment : ${ENV}`);
  console.log(`📡 Server URL  : http://localhost:${PORT}`);
  console.log(`🔥 Status      : RUNNING`);
  console.log('==============================\n');
});

/**
 * 🔥 Handle unhandled promise rejections (async errors)
 */
process.on('unhandledRejection', (err) => {
  console.error('\n❌ UNHANDLED REJECTION!');
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  server.close(() => {
    process.exit(1);
  });
});

/**
 * 🛑 Graceful shutdown (important for production / deployment)
 */
process.on('SIGTERM', () => {
  console.log('\n⚠️ SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT RECEIVED (Ctrl+C). Shutting down...');
  server.close(() => {
    console.log('💤 Server stopped.');
    process.exit(0);
  });
});