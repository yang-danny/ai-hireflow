import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
   error: 0,
   warn: 1,
   info: 2,
   http: 3,
   debug: 4,
};

// Define colors for each level
const colors = {
   error: 'red',
   warn: 'yellow',
   info: 'green',
   http: 'magenta',
   debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
   winston.format.errors({ stack: true }),
   winston.format.splat(),
   winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
   winston.format.colorize({ all: true }),
   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
   winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
   )
);

// Create transports
const transports: winston.transport[] = [];

// Console transport (always enabled)
if (process.env.NODE_ENV !== 'production') {
   transports.push(
      new winston.transports.Console({
         format: consoleFormat,
      })
   );
} else {
   transports.push(
      new winston.transports.Console({
         format: winston.format.simple(),
      })
   );
}

// File transport for errors (always write errors to file)
transports.push(
   new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format,
   })
);

// File transport for all logs (only in production)
if (process.env.NODE_ENV === 'production') {
   transports.push(
      new DailyRotateFile({
         filename: path.join('logs', 'combined-%DATE%.log'),
         datePattern: 'YYYY-MM-DD',
         maxSize: '20m',
         maxFiles: '14d',
         format,
      })
   );
}

// Create the logger
const logger = winston.createLogger({
   level:
      process.env.LOG_LEVEL ||
      (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
   levels,
   format,
   transports,
   // Don't exit on handled exceptions
   exitOnError: false,
});

// Create a stream for Morgan HTTP logging
export const stream = {
   write: (message: string) => {
      logger.http(message.trim());
   },
};

export default logger;
