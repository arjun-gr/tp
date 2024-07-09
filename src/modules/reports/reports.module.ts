import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { DatabaseModule } from '../database/database.module';
import { FilesModule } from '../file/files.module';
import { ServicesModule } from '../services/services.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [ConfigModule, DatabaseModule, ServicesModule, FilesModule],
  controllers: [ReportsController],
  exports: [ReportsService],
  providers: [ReportsService, PadcareFiles],
})
export class ReportsModule {}
