import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { CommonController } from './common.controller';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [CommonController],
})
export class CommonModule {}
