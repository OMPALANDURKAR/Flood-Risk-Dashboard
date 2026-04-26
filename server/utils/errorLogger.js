const fs = require('fs');
const path = require('path');

const errorLogPath = path.join(__dirname, '../logs/errors.log');

exports.logError = (err, req) => {
  const log = `
${new Date().toISOString()}
${req.method} ${req.originalUrl}
Message: ${err.message}
Stack: ${err.stack}
-----------------------------
`;

  fs.appendFile(errorLogPath, log, (e) => {
    if (e) console.error('Error log write failed:', e);
  });
};