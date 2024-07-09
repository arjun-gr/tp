import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendEmail(data) {
    console.log('queue :', data);
    await this.emailQueue.add(data);
  }
}
