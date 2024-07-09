import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
