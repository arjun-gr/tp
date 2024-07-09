import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductService } from '../product/product.service';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [TicketService, ProductService],
  exports: [TicketService],
})
export class TicketModule {}
