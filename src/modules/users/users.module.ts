import { Module } from '@nestjs/common';
import { CryptoService } from '../../providers/crypto.service';
import { CityModule } from '../city/city.module';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, CityModule],
  controllers: [UsersController],
  providers: [CryptoService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
