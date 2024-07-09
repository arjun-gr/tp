import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Source } from '../../common/enums/notifications';
import { UserType } from '../../common/enums/user-type';
import { Notifications } from '../../entities/notifications.entity';
import { User } from '../../entities/user.entity';
import {
  ICampNotificationPayload,
  IGetReceiversUserIds,
  INotification,
  IServiceNotificationPayload,
  ITicketNotificationPayload,
} from '../../interfaces/notifications';
import { NOTIFICATION_REPOSITORY } from '../database/database.providers';
import { UsersService } from '../users/users.service';
import { AwarenessCampNotificationService } from './awareness-camp-notif.service';
import { ServicesNotificationService } from './services-notif.service';
import { TicketNotificationService } from './ticket-notif.service';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private notificationRepository: Repository<Notifications>,
    private userService: UsersService,
    private serviceNotification: ServicesNotificationService,
    private ticketNotification: TicketNotificationService,
    @Inject(forwardRef(() => AwarenessCampNotificationService))
    private awarenessCampNotification: AwarenessCampNotificationService,
  ) {}

  async markNotificationAsRead(id: number) {
    await this.throwIfNotificationNotExists(id);
    this.notificationRepository.update(id, { isRead: true });
    return {
      id,
      message: 'Successfully Mark Notification as read',
    };
  }

  findOne(id: number) {
    return this.throwIfNotificationNotExists(id);
  }

  findAll() {
    return this.notificationRepository.find();
  }

  async findAllNotificationByUserId(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ) {
    const order = pageOptionsDto.order;
    let where: any = {};
    if (user.userType == UserType.Client) {
      where['toUser'] = { id: user.client.id };
    } else {
      where['toUser'] = { id: user.id };
    }

    let [list, count]: any = await this.notificationRepository.findAndCount({
      where: where,
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  async throwIfNotificationNotExists(id: number) {
    let notification = await this.notificationRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!notification) throw new Error('Notification not found');
    return notification;
  }

  @OnEvent(Events.NOTIFICATION_CREATED)
  async notificationCreated(event: {
    data: {
      from: User;
      notification?: string;
      title?: string;
      extraParams?: string;
      data: {
        service: IServiceNotificationPayload;
        ticket: ITicketNotificationPayload;
        awarenessCamp: ICampNotificationPayload;
      };
      source: Source;
    };
  }) {
    const {
      data: { from: user, notification, title, extraParams, data, source },
    } = event;
    await this.getReceiversInfo({ user, data, source });
  }

  async getReceiversInfo({ user, data, source }: IGetReceiversUserIds) {
    if (source == Source.SERVICE) {
      await this.serviceNotification.sendServiceNotifications(
        user,
        data.service,
      );
    }
    if (source == Source.CUSTOMER_CARE) {
      await this.ticketNotification.sendTicketNotifications(user, data.ticket);
    }
    if (source == Source.AWARENESS_CAMP) {
      await this.awarenessCampNotification.sendNotifications(
        user,
        data.awarenessCamp,
      );
    }
  }

  async createNotifications(notif: INotification) {
    const { receiverIds, notification, title, type, fromUser: user } = notif;
    if (!receiverIds?.length) return;
    const userIds = await this.userService.getUserByIds(receiverIds);
    for (const userId of receiverIds) {
      const notifications = new Notifications();
      notifications.fromUser = user;
      notifications.toUser = userIds.find((i: any) => i.id == userId);
      notifications.notification = notification;
      notifications.title = title;
      notifications.isRead = false;
      notifications.extraPram = JSON.stringify(notif);
      notifications.type = type;
      await this.notificationRepository.save(notifications);
    }
  }
}
