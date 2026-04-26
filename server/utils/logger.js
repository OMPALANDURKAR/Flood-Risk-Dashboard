const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/requests.log');

exports.logRequest = (req) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(logFilePath, log, (err) => {
    if (err) console.error('Log write error:', err);
  });
};
