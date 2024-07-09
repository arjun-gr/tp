import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AwarenessCampController } from './awareness_camp.controller';
import { AwarenessCampService } from './awareness_camp.service';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AwarenessCampController],
  providers: [AwarenessCampService],
  exports: [AwarenessCampService],
})
export class AwarenessCampModule {}
