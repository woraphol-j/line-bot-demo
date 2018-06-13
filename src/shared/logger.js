const config = require('config');
const winston = require('winston');

const consoleTransport = new winston.transports.Console({
  json: false,
  prettyPrint: true,
  level: config.get('logger.level'),
  colorize: true,
  timestamp: true,
  handleExceptions: true,
});

const logger = new winston.Logger({
  transports: [consoleTransport],
});

module.exports = logger;
