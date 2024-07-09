import { Module } from '@nestjs/common';
import DBLoggerService from './db-logger.service';

@Module({
  providers: [DBLoggerService],
  exports: [DBLoggerService],
})
export class LoggerModule {}
