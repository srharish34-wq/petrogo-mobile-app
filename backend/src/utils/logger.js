/**
 * Logger Utility
 * Handles logging throughout the application
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

/**
 * Format timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format log message
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}\n`;
};

/**
 * Write to log file
 */
const writeToFile = (filePath, message) => {
  try {
    fs.appendFileSync(filePath, message, 'utf8');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

/**
 * Log levels with colors
 */
const colors = {
  info: '\x1b[36m',    // Cyan
  success: '\x1b[32m', // Green
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m'     // Reset
};

/**
 * Info log
 */
const info = (message, meta = {}) => {
  const formattedMessage = formatMessage('info', message, meta);
  console.log(`${colors.info}ℹ️  ${message}${colors.reset}`, meta);
  writeToFile(combinedLogPath, formattedMessage);
};

/**
 * Success log
 */
const success = (message, meta = {}) => {
  const formattedMessage = formatMessage('success', message, meta);
  console.log(`${colors.success}✅ ${message}${colors.reset}`, meta);
  writeToFile(combinedLogPath, formattedMessage);
};

/**
 * Warning log
 */
const warn = (message, meta = {}) => {
  const formattedMessage = formatMessage('warn', message, meta);
  console.warn(`${colors.warn}⚠️  ${message}${colors.reset}`, meta);
  writeToFile(combinedLogPath, formattedMessage);
};

/**
 * Error log
 */
const error = (message, meta = {}) => {
  const formattedMessage = formatMessage('error', message, meta);
  console.error(`${colors.error}❌ ${message}${colors.reset}`, meta);
  writeToFile(errorLogPath, formattedMessage);
  writeToFile(combinedLogPath, formattedMessage);
};

/**
 * Debug log (only in development)
 */
const debug = (message, meta = {}) => {
  if (process.env.NODE_ENV === 'development') {
    const formattedMessage = formatMessage('debug', message, meta);
    console.log(`${colors.debug}🐛 ${message}${colors.reset}`, meta);
    writeToFile(combinedLogPath, formattedMessage);
  }
};

/**
 * API Request log
 */
const request = (req, res, duration) => {
  const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
  const meta = {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip
  };
  
  if (res.statusCode >= 400) {
    warn(message, meta);
  } else {
    info(message, meta);
  }
};

/**
 * Database log
 */
const database = (operation, message, meta = {}) => {
  info(`[DB] ${operation}: ${message}`, meta);
};

/**
 * Auth log
 */
const auth = (action, message, meta = {}) => {
  info(`[AUTH] ${action}: ${message}`, meta);
};

/**
 * Payment log
 */
const payment = (action, message, meta = {}) => {
  info(`[PAYMENT] ${action}: ${message}`, meta);
};

/**
 * Order log
 */
const order = (action, message, meta = {}) => {
  info(`[ORDER] ${action}: ${message}`, meta);
};

/**
 * Clear old logs (older than 30 days)
 */
const clearOldLogs = () => {
  try {
    const files = fs.readdirSync(logsDir);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted old log file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Failed to clear old logs:', error);
  }
};

/**
 * Get log file content
 */
const getLogFile = (type = 'combined') => {
  try {
    const filePath = type === 'error' ? errorLogPath : combinedLogPath;
    
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    return 'No logs found';
  } catch (error) {
    return `Error reading log file: ${error.message}`;
  }
};

/**
 * Log separator
 */
const separator = () => {
  console.log('='.repeat(80));
};

module.exports = {
  info,
  success,
  warn,
  error,
  debug,
  request,
  database,
  auth,
  payment,
  order,
  clearOldLogs,
  getLogFile,
  separator
};