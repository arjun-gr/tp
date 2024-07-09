import { format } from 'winston';

export const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.errors({ stack: true }),
  format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message} `;
    if (metadata) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  }),
);

const options = {
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 2,
  colorize: false,
  prettyPrint: true,
};

export const loggerConfig: any = {
  file_error: {
    level: 'error',
    filename: 'logs/error.log',
    ...options,
  },
  file_debug: {
    level: 'debug',
    filename: 'logs/debug.log',
    ...options,
  },
  file_info: {
    level: 'info',
    filename: 'logs/info.log',
    ...options,
  },
};
