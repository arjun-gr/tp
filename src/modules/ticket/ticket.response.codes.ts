import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class TicketResponseCodes extends AppResponseCodes {
  public static CLIENT_NOT_EXISTS: any = new BadRequestException(
    'Client not exists',
  );

  public static BRANCH_NOT_EXISTS: any = new BadRequestException(
    'Branch not exists',
  );

  public static TICKET_NOT_EXISTS: any = new BadRequestException(
    'Ticket not exists',
  );

  public static USER_NOT_EXISTS: any = new BadRequestException(
    'User not exists',
  );

  public static TICKET_UPDATE_ACTION_DENIED: any = new BadRequestException(
    'Can not update status of Completed or Cancelled ticket',
  );

  public static VM_PRODUCT_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Invalid Vending Machine Product Type',
  );

  public static FHU_PRODUCT_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Invalid Female Hygiene Unit Product Type',
  );

  public static TICKET_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Invalid Ticket Type',
  );

  public static TICKET_PRIORITY_NOT_EXISTS: any = new NotFoundException(
    'Invalid Ticket priority value',
  );
}
