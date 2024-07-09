import { Module, forwardRef } from '@nestjs/common';
import { CityModule } from '../city/city.module';
import { DatabaseModule } from '../database/database.module';
import { ProductService } from '../product/product.service';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';
import { BranchProductService } from './branch-product.service';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { CryptoService } from 'src/providers/crypto.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => ServicesModule),
    CityModule,
    // forwardRef(() => BranchService),
  ],
  controllers: [ClientController, PurchaseController, BranchController],
  providers: [
    ClientService,
    BranchService,
    ProductService,
    BranchProductService,
    PurchaseService,
    CryptoService,
  ],
  exports: [
    ClientService,
    BranchProductService,
    BranchService,
    PurchaseService,
  ],
})
export class ClientModule {}
