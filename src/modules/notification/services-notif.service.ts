import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ServiceType } from '../../common/enums/services';
import { UserType } from '../../common/enums/user-type';
import { User } from '../../entities/user.entity';
import {
  IServiceNotifPayload,
  IServiceNotificationPayload,
} from '../../interfaces/notifications';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from './notification.service';
import { createServiceNotificationMsg } from './notifications.helper';

@Injectable()
export class ServicesNotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private userService: UsersService,
    private service: ServicesService,
  ) {}

  async sendServiceNotifications(
    user: User,
    service: IServiceNotificationPayload,
  ) {
    const { serviceId } = service;
    const receiverIds = [];
    const serviceDetails: any =
      await this.service.getServiceDetailForNotification(serviceId);
    const employeeList =
      (serviceDetails?.city?.users?.length &&
        serviceDetails?.city?.users?.map((i: any) => i.id)) ||
      [];
    const serviceInfo = {
      clientId: serviceDetails.client.id,
      clientName: serviceDetails.client.name,
      cityName: serviceDetails.city.name,
      branchName: serviceDetails.branch.name,
      productName:
        (serviceDetails?.serviceProduct?.length &&
          serviceDetails?.serviceProduct[0]?.product?.name) ||
        '',
    };
    if (user.userType == UserType.SUPER_ADMIN) {
      receiverIds.push(...employeeList);
      receiverIds.push(serviceInfo.clientId);
    }
    if (user.userType == UserType.Employee) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(...adminIds);
      receiverIds.push(serviceInfo.clientId);
    }
    if (user.userType == UserType.Client) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(...employeeList);
      receiverIds.push(...adminIds);
    }
    const notification = this.createNotificationPayload(
      receiverIds,
      service,
      serviceInfo,
    );
    await this.notificationService.createNotifications({
      ...notification,
      fromUser: user,
    });
  }

  createNotificationPayload(
    receiverIds: number[],
    service: IServiceNotificationPayload,
    payload: IServiceNotifPayload,
  ) {
    const { serviceId, status, serviceType, type } = service;
    const { clientName, cityName, branchName, productName } = payload;
    let notificationMsg = createServiceNotificationMsg(
      {
        companyName: clientName,
        status: status,
        text: this.getServiceNotificationText({
          type: serviceType,
          productName,
        }),
      },
      UserType.SUPER_ADMIN,
    );
    return {
      receiverIds,
      notification: notificationMsg,
      title: '',
      serviceId,
      companyName: clientName,
      cityName,
      branchName,
      status,
      type,
    };
  }

  private getServiceNotificationText(service: any) {
    if (service.type == ServiceType.SERVICE) {
      return `${service.productName} ${ServiceType.SERVICE} Status :`;
    } else if (service.type == ServiceType.INSTALLATION) {
      return `${ServiceType.INSTALLATION} Service Scheduled Status :`;
    } else if (service.type == ServiceType.DEMO) {
      return `${ServiceType.DEMO} Scheduled Status :`;
    }
  }
}
