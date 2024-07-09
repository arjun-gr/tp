import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logFormat, loggerConfig } from 'src/config/logger.config';
import { createLogger, transports, Logger } from 'winston';

@Injectable()
export class LoggerService {
  private errorLogger: Logger;
  private debugLogger: Logger;
  private infoLogger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.errorLogger = createLogger(
      this.getLoggerProperty(loggerConfig.file_error),
    );
    this.debugLogger = createLogger(
      this.getLoggerProperty(loggerConfig.file_debug),
    );
    this.infoLogger = createLogger(
      this.getLoggerProperty(loggerConfig.file_info),
    );
  }

  private getLoggerProperty(loggerConfig: any) {
    const config = {
      format: logFormat,
      defaultMeta: { service: this.configService.get<string>('APP_NAME') },
      transports: [new transports.File(loggerConfig)],
      exitOnError: false,
    };
    return config;
  }

  /**
   * Methods to obtain error logger instance.
   * Use .error() method to log the message.
   */
  getErrorLogger(): Logger {
    return this.errorLogger;
  }

  /**
   * Methods to obtain debug logger instance.
   * Use .debug() method to log the message.
   */
  getDebugLogger(): Logger {
    return this.debugLogger;
  }

  /**
   * Methods to obtain info logger instance.
   * Use .info() method to log the message.
   */
  getInfoLogger(): Logger {
    return this.infoLogger;
  }
}
