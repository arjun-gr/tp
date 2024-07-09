import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { FeaturePostController } from './feature_post.controller';
import { FeaturePostService } from './feature_post.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [FeaturePostController],
  providers: [FeaturePostService],
})
export class FeaturePostModule {}
