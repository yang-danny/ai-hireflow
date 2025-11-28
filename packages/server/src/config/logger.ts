import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import os from 'os';

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

// Add default metadata to all logs
const defaultMeta = {
   service: 'ai-hireflow-api',
   environment: process.env.NODE_ENV || 'development',
   hostname: os.hostname(),
   pid: process.pid,
};

// Define log format with metadata
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
      maxFiles: '30d', // Increased from 14d for error retention
      format,
      zippedArchive: true, // Compress old logs
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
         zippedArchive: true,
      })
   );
}

// Optional: CloudWatch transport (if AWS credentials are configured)
// Uncomment and install 'winston-cloudwatch' package to enable
// if (process.env.AWS_CLOUDWATCH_LOG_GROUP && process.env.AWS_REGION) {
//    const WinstonCloudWatch = require('winston-cloudwatch');
//    transports.push(
//       new WinstonCloudWatch({
//          logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP,
//          logStreamName: `${defaultMeta.service}-${defaultMeta.hostname}`,
//          awsRegion: process.env.AWS_REGION,
//          jsonMessage: true,
//       })
//    );
// }

// Create the logger
const logger = winston.createLogger({
   level:
      process.env.LOG_LEVEL ||
      (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
   levels,
   format,
   defaultMeta,
   transports,
   // Don't exit on handled exceptions
   exitOnError: false,
   // Handle uncaught exceptions and rejections
   exceptionHandlers: [
      new DailyRotateFile({
         filename: path.join('logs', 'exceptions-%DATE%.log'),
         datePattern: 'YYYY-MM-DD',
         maxSize: '20m',
         maxFiles: '30d',
         zippedArchive: true,
      }),
   ],
   rejectionHandlers: [
      new DailyRotateFile({
         filename: path.join('logs', 'rejections-%DATE%.log'),
         datePattern: 'YYYY-MM-DD',
         maxSize: '20m',
         maxFiles: '30d',
         zippedArchive: true,
      }),
   ],
});

// Create a stream for Morgan HTTP logging
export const stream = {
   write: (message: string) => {
      logger.http(message.trim());
   },
};

export default logger;
