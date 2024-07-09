import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BullConfigService } from '../../config/bull.config';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'email',
      imports: [],
      useClass: BullConfigService,
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
