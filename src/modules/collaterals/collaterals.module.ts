import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { CollateralsController } from './collaterals.controller';
import { CollateralsService } from './collaterals.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [CollateralsController],
  providers: [CollateralsService],
})
export class CollateralsModule {}
