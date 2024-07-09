import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class ServiceResponseCodes extends AppResponseCodes {
  public static CLIENT_NOT_EXISTS: any = new BadRequestException(
    'Client not exists',
  );

  public static BRANCH_NOT_EXISTS: any = new BadRequestException(
    'Branch not exists',
  );

  public static SERVICE_NOT_EXISTS: any = new BadRequestException(
    'Service not exists',
  );

  public static USER_NOT_EXISTS: any = new BadRequestException(
    'User not exists',
  );

  public static SERVICE_UPDATE_ACTION_DENIED: any = new BadRequestException(
    'Can not update status of Completed or Cancelled service',
  );
}
