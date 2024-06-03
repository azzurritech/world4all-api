const {
  createLogger: winstonLogger, format, transports,
} = require('winston');

const errorFormatter = format((info) => {
  if (info.error && info.error instanceof Error) {
    const formattedError = { ...info };

    formattedError.error = {
      name: info.error.name,
      message: info.error.message,
      stackTrace: info.error.stack,
    };

    return formattedError;
  }

  return info;
})();

const logger = winstonLogger({
  // Add error level if you need
  transports: [
    new transports.Console(),
  ],

  format: format.combine(
    format.timestamp(),
    format.colorize(),
    errorFormatter,
    format.simple(),
  ),
});

function createLogger(ctx) {
  return logger.child(ctx);
}

module.exports = { createLogger };
