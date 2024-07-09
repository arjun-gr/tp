import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { DatabaseModule } from '../database/database.module';
import { ReportsModule } from '../reports/reports.module';
import { ServicesModule } from '../services/services.module';
import { ServiceCron } from './services-cron.service';
import { TasksService } from './tasks.service';
import { TicketCron } from './ticket-cron.service';

@Module({
  imports: [DatabaseModule, ReportsModule, ClientModule, ServicesModule],
  providers: [TasksService, ServiceCron, TicketCron],
})
export class TasksModule {}
