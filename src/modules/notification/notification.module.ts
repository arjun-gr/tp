import { Module } from '@nestjs/common';
import { AwarenessCampModule } from '../awareness_camp/awareness_camp.module';
import { CityModule } from '../city/city.module';
import { DatabaseModule } from '../database/database.module';
import { QueueModule } from '../queue/queue.module';
import { QueueService } from '../queue/queue.service';
import { ServicesModule } from '../services/services.module';
import { TicketModule } from '../ticket/ticket.module';
import { UsersModule } from '../users/users.module';
import { AwarenessCampNotificationService } from './awareness-camp-notif.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotifyQueueService } from './notify-queue.service';
import { ServicesNotificationService } from './services-notif.service';
import { TicketNotificationService } from './ticket-notif.service';

@Module({
  imports: [
    DatabaseModule,
    QueueModule,
    ServicesModule,
    CityModule,
    UsersModule,
    TicketModule,
    AwarenessCampModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotifyQueueService,
    QueueService,
    NotificationService,
    ServicesNotificationService,
    TicketNotificationService,
    AwarenessCampNotificationService,
  ],
  exports: [NotifyQueueService, QueueService, NotificationService],
})
export class NotificationModule {}
