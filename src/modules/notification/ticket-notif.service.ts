import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EmployeeType } from '../../common/enums/employee-type';
import { TicketStatus } from '../../common/enums/ticket-status';
import { UserType } from '../../common/enums/user-type';
import { User } from '../../entities/user.entity';
import {
  ITicketNotifPayload,
  ITicketNotificationPayload,
} from '../../interfaces/notifications';
import { TicketService } from '../ticket/ticket.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from './notification.service';
import { createTicketNotificationMsg } from './notifications.helper';

@Injectable()
export class TicketNotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private userService: UsersService,
    private ticketService: TicketService,
  ) {}

  async sendTicketNotifications(
    user: User,
    ticket: ITicketNotificationPayload,
  ) {
    const { ticketId } = ticket;
    const receiverIds = [];
    const ticketDetails = await this.ticketService.getTicketById(ticketId);
    const cityManager = ticketDetails?.city?.users?.find(
      (i: any) => i?.employeeProfile?.type === EmployeeType.CITY_OPS_MANAGER,
    );
    const ticketInfo = {
      clientId: ticketDetails.client.id,
      clientName: ticketDetails.client.name,
      cityId: ticketDetails.branch.city.id,
      cityName: ticketDetails.branch.city.name,
      branchName: ticketDetails.branch.name,
      branchId: ticketDetails.branch.id,
      ticketType: ticketDetails.type,
      productName: ticketDetails?.product?.name || '',
      // binName: ticketDetails?.bin?.name || '',
      createdBy: ticketDetails.createdBy.name,
      status: ticketDetails.ticketStatus || '',
      userType: ticketDetails.createdBy.userType,
    };
    if (user.userType == UserType.SUPER_ADMIN) {
      receiverIds.push(cityManager?.id);
      receiverIds.push(ticketInfo.clientId);
    }
    if (user.userType == UserType.Employee) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(...adminIds);
      receiverIds.push(ticketInfo.clientId);
    }
    if (user.userType == UserType.Client) {
      const admin = await this.userService.getSuperAdminIds();
      const adminIds = (admin?.length && admin?.map((i: any) => i.id)) || [];
      receiverIds.push(cityManager?.id);
      receiverIds.push(...adminIds);
    }
    const notification = this.createNotificationPayload(
      receiverIds,
      ticket,
      ticketInfo,
    );
    await this.notificationService.createNotifications({
      ...notification,
      fromUser: user,
    });
  }

  createNotificationPayload(
    receiverIds: number[],
    ticket: ITicketNotificationPayload,
    payload: ITicketNotifPayload,
  ) {
    const { ticketId, ticketType, status, type } = ticket;

    const {
      clientName,
      cityName,
      branchName,
      productName,
      binName,
      createdBy,
      userType,
      status: ticketStatus,
    } = payload;
    let notificationMsg = createTicketNotificationMsg(
      {
        clientName,
        status: status || ticketStatus,
        text: this.getTicketNotificationText({
          type: ticketType,
          status,
          clientName,
          createdBy,
        }),
        ticketType,
      },
      userType as UserType,
    );
    return {
      receiverIds,
      notification: notificationMsg,
      title: '',
      ticketId,
      companyName: clientName,
      cityName,
      branchName,
      status: status || ticketStatus,
      type,
    };
  }

  private getTicketNotificationText(ticket: any) {
    const { status, clientName, createdBy } = ticket;
    if (status == TicketStatus.COMPLETED) {
      return `type ticket is resolved for "${clientName}". status`;
    } else if (status == TicketStatus.COMPLETED) {
      return `type ticket closed for "${clientName}". status :`;
    } else {
      return `type ticket raised by "${createdBy}" for "${clientName}" status`;
    }
  }
}
