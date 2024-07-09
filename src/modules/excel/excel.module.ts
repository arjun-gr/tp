import { Module } from '@nestjs/common';
import { CityModule } from '../city/city.module';
import { ClientModule } from '../client/client.module';
import { ProductModule } from '../product/product.module';
import { UsersModule } from '../users/users.module';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { StateModule } from '../state/state.module';
import { DatabaseModule } from '../database/database.module';
import { ServicesModule } from '../services/services.module';
import { ServicesService as ServicesServiceRefactor } from '../services/services.refactor.service';
import { ServiceProductService as ServiceProductServiceRefactor } from '../services/service-product.refactor.service';
import { CryptoService } from 'src/providers/crypto.service';

@Module({
  imports: [
    DatabaseModule,
    CityModule,
    UsersModule,
    ClientModule,
    ProductModule,
    StateModule,
    ServicesModule,
  ],
  controllers: [ExcelController],
  providers: [
    ExcelService,
    ServicesServiceRefactor,
    ServiceProductServiceRefactor,
    CryptoService,
  ],
})
export class ExcelModule {}
