import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CityModule } from '../city/city.module';
import { ClientModule } from '../client/client.module';
import { DatabaseModule } from '../database/database.module';
import { ProductModule } from '../product/product.module';
import { ServiceProductService } from './service-product.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesService as ServicesServiceRefactor  } from './services.refactor.service';
import { ServiceProductService as ServiceProductServiceRefactor } from './service-product.refactor.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    forwardRef(() => ClientModule),
    forwardRef(() => CityModule),
    ProductModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServiceProductService,ServicesServiceRefactor,ServiceProductServiceRefactor],
  exports: [ServicesService, ServiceProductService,ServicesServiceRefactor,ServiceProductServiceRefactor],
})
export class ServicesModule {}
