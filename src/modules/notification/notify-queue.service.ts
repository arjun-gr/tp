import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../common/constants/events.constants';
import { QueueService } from '../queue/queue.service';
@Injectable()
export class NotifyQueueService {
  constructor(private queueService: QueueService) {}

  async addEmailLog() {
    try {
    } catch (ex) {
      console.log('add Log error : ', ex.message);
      throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
    }
  }

  @OnEvent(Events.SERVICE_CREATED)
  async serviceCreated() {}

  sendEmailNotification() {
    console.log('Email notification');
    // if (users.length) {
    //   users.forEach((item) => {
    //     const emailParam = {
    //       email: item.email,
    //       firstName: item.firstName,
    //       message: notiData.message,
    //       emailType: 'user_notification',
    //       title: notiData.title,
    //     };
    //     this.queueService.sendEmail(emailParam);
    //   });
    // }
  }
}
