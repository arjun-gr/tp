import { notificationStatusColor } from '../../common/enums/notifications';
import { UserType } from '../../common/enums/user-type';
import {
  IAwarenessCampNotifPayload,
  IServiceNotifPayload,
  ITicketNotifPayload,
} from '../../interfaces/notifications';

export const createServiceNotificationMsg = (
  payload: IServiceNotifPayload,
  userType: UserType,
) => {
  const { companyName, status, text } = payload;

  return `<div class='space-y-1 dark:text-white text-left'>
    <div class='text-base text-grayShades-riverBed '>
      ${
        [UserType.SUPER_ADMIN, UserType.Employee].includes(userType)
          ? `<span class='font-semibold'>${companyName}</span>`
          : ''
      }
      <span>"${text}</span>
      <span style="color:${
        notificationStatusColor[status]
      }" class="${`font-semibold !text-[${notificationStatusColor[status]}]`}">${status}</span>"
    </div>
  </div>
    `;
};

export const createTicketNotificationMsg = (
  payload: ITicketNotifPayload,
  userType: UserType,
) => {
  const { ticketType, text, status } = payload;

  return `<div class='space-y-1 dark:text-white text-left'>
    <div class='text-base text-grayShades-riverBed '>
    <span class='font-semibold'>${ticketType}</span>
      <span>"${text}</span>
      <span style="color:${
        notificationStatusColor[status]
      }" class="${`font-semibold !text-[${notificationStatusColor[status]}]`}">${status}</span>"
    </div>
  </div>
    `;
};

export const createAwarenessCampNotificationMsg = (
  payload: IAwarenessCampNotifPayload,
  userType: UserType,
) => {
  const { text, status } = payload;

  return `<div class='space-y-1 dark:text-white text-left'>
    <div class='text-base text-grayShades-riverBed '>
    <span class='font-semibold'>Awareness Camp</span>
      <span>"${text}</span>
      <span style="color:${
        notificationStatusColor[status]
      }" class="${`font-semibold !text-[${notificationStatusColor[status]}]`}">${status}</span>"
    </div>
  </div>
    `;
};
