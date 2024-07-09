import {
  AwarenessCampClientStatus,
  AwarenessCampStatus,
} from '../common/enums/awareness-camp';
import { NOTIFICATION_TYPES, Source } from '../common/enums/notifications';
import { ServiceStatus, ServiceType } from '../common/enums/services';
import { TicketStatus } from '../common/enums/ticket-status';
import { TicketType } from '../common/enums/ticket-type';
import { User } from '../entities/user.entity';

// export interface ISource {
//   CLIENT: 'CLIENT';
//   BRANCH: 'BRANCH';
//   SERVICE: 'SERVICE';
//   AWARENESS_CAMP: 'AWARENESS_CAMP';
//   CUSTOMER_CARE: 'CUSTOMER_CARE';
// }

export interface INotification {
  receiverIds: number[];
  fromUser: User;
  toUser?: number | User;
  notification: string;
  title?: string;
  isRead?: boolean;
  extraPram?: string;
  type: string;
}

export interface INotificationPayload {
  from: User;
  notification?: string;
  title?: string;
  extraParams?: string;
  source: Source;
  data: {
    service: IServiceNotificationPayload;
  };
}

export interface IServiceNotificationPayload {
  serviceId: number;
  status: ServiceStatus;
  type: NOTIFICATION_TYPES;
  serviceType: ServiceType;
}

export interface IGetReceiversUserIds {
  user: User;
  source: Source;
  data: {
    service?: IServiceNotificationPayload;
    ticket?: ITicketNotificationPayload;
    awarenessCamp?: ICampNotificationPayload;
  };
}

export interface IServiceNotifPayload {
  companyName?: string;
  text?: string;
  colorCode?: string;
  status?: string;
  date?: Date;
  serviceType?: ServiceType;
  employeeList?: number[];
  clientId?: number;
  clientName?: string;
  cityName?: string;
  branchName?: string;
  productName?: string;
}

export interface ITicketNotificationPayload {
  ticketId: number;
  status: TicketStatus;
  type: NOTIFICATION_TYPES | null;
  ticketType: TicketType;
}

export interface ITicketNotifPayload {
  text?: string;
  status?: string;
  clientId?: number;
  clientName?: string;
  cityId?: number;
  cityName?: string;
  branchName?: string;
  branchId?: number;
  ticketType?: string;
  productName?: string;
  binName?: string;
  createdBy?: string;
  userType?: string;
}

export interface ICampNotificationPayload {
  awarenessCampId: number;
  status: AwarenessCampStatus;
  clientStatus: AwarenessCampClientStatus;
  type: NOTIFICATION_TYPES | null;
}

export interface IAwarenessCampNotifPayload {
  text?: string;
  status?: string;
  clientId?: number | null;
  clientName?: string;
  userId?: number;
  name?: string;
  createdBy?: string;
  userType?: string;
}
