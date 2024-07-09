import { EmployeeType } from '../../../../common/enums/employee-type';
import { TicketStatus } from '../../../../common/enums/ticket-status';
import { Ticket } from '../../../../entities/ticket.entity';
import { User } from '../../../../entities/user.entity';

export class TicketListResponse {
  id: number;
  number: number;
  date: Date;
  type: string;
  product: any;
  // bin: FHU_PRODUCT_TYPE;
  priority: string;
  ticketStatus: TicketStatus;
  subject: string;
  description: string;
  clientName: string;
  branchName: string;
  city: string;
  complaintCode: string;
  status: string;
  createdBy: User;
  cityOpManagerUser: string;

  constructor(data: Ticket) {
    this.id = data.id;
    // this.number = data.number;
    this.date = data.date;
    this.type = data.type;
    // this.priority = data.priority;
    this.ticketStatus = data?.ticketStatus as TicketStatus;
    this.subject = data?.subject;
    this.clientName = data?.client?.name;
    this.branchName = data?.branch?.name;
    this.city = data?.branch?.city?.name;
    this.complaintCode = data?.complaintCode;
    this.createdBy = data?.createdBy;
    this.cityOpManagerUser = data?.branch?.city?.users?.find(
      (i) => i?.employeeProfile?.type === EmployeeType.CITY_OPS_MANAGER,
    )?.name;
    this.product = data?.product
      ? { id: data?.product?.id, name: data?.product?.id }
      : {};
  }
}
