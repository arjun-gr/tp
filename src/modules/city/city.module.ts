import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
