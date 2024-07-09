import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AwarenessCampStatus } from '../../common/enums/awareness-camp';
import { EmployeeType } from '../../common/enums/employee-type';
import { NOTIFICATION_TYPES } from '../../common/enums/notifications';
import { UserType } from '../../common/enums/user-type';
import { User } from '../../entities/user.entity';
import {
  IAwarenessCampNotifPayload,
  ICampNotificationPayload,
} from '../../interfaces/notifications';
import { AwarenessCampService } from '../awareness_camp/awareness_camp.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from './notification.service';
import { createAwarenessCampNotificationMsg } from './notifications.helper';

@Injectable()
export class AwarenessCampNotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private userService: UsersService,
    private awarenessCamp: AwarenessCampService,
  ) {}

  async sendNotifications(user: User, awarenessCamp: ICampNotificationPayload) {
    const { awarenessCampId } = awarenessCamp;
    const receiverIds = [];
    const awarenessCampDetail: any =
      await this.awarenessCamp.getAwarenessCampDetails(awarenessCampId);
    const cityManager = awarenessCampDetail?.city?.users?.find(
      (i: any) => i?.employeeProfile?.type === EmployeeType.CITY_OPS_MANAGER,
    );
    const awarenessCampInfo = {
      clientId: awarenessCampDetail?.client?.id || null,
      clientName: awarenessCampDetail?.client?.name || null,
      // userId: awarenessCampDetail.user.id,
      name: awarenessCampDetail?.client?.name,
      createdBy: awarenessCampDetail?.createdBy?.name,
      userType: awarenessCampDetail?.createdBy?.userType,
    };
    if (user.userType == UserType.SUPER_ADMIN) {
      receiverIds.push(cityManager?.id);
      receiverIds.push(awarenessCampInfo.clientId);
    }
    if (user.userType == UserType.Employee) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(...adminIds);
      receiverIds.push(awarenessCampInfo.clientId);
    }
    if (user.userType == UserType.Client) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(cityManager?.id);
      receiverIds.push(...adminIds);
    }

    const notification = this.createNotificationPayload(
      receiverIds,
      awarenessCamp,
      awarenessCampInfo,
    );
    await this.notificationService.createNotifications({
      ...notification,
      fromUser: user,
    });
  }

  createNotificationPayload(
    receiverIds: number[],
    awarenessCamp: ICampNotificationPayload,
    payload: IAwarenessCampNotifPayload,
  ) {
    const { awarenessCampId, status, type } = awarenessCamp;

    const { clientName, name, createdBy, userType } = payload;
    let notificationMsg = createAwarenessCampNotificationMsg(
      {
        clientName: name,
        status: status,
        text: this.getNotificationText({
          status: status,
          clientName: name,
          createdBy,
          userType,
          type,
        }),
      },
      userType as UserType,
    );
    return {
      receiverIds,
      notification: notificationMsg,
      title: '',
      awarenessCampId,
      companyName: clientName,
      status: status,
      type,
    };
  }

  private getNotificationText(ticket: any) {
    const { status, clientName, createdBy, userType, type } = ticket;
    if (type == NOTIFICATION_TYPES.AWARENESSCAMP_DELETED) {
      return `deleted by the "${createdBy}". Status :`;
    }
    if (status == AwarenessCampStatus.COMPLETED) {
      return `successfully ${status} for client "${clientName}". Status :`;
    } else if (status == AwarenessCampStatus.REJECT) {
      return `Cancelled for client "${clientName}". Status :`;
    } else {
      if (userType == UserType.Client) {
        return `Scheduled by the client "${createdBy}". Status :`;
      } else {
        return `Scheduled by the "${createdBy}". Status :`;
      }
    }
  }
}
