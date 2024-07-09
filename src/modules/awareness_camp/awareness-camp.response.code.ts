import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class AwarenessCampResponseCodes extends AppResponseCodes {
  public static AWARENESS_CAMP_NOT_EXISTS: any = new NotFoundException(
    'Awareness Camp not exists',
  );

  public static CLIENT_NOT_EXISTS: any = new BadRequestException(
    'Client not exists',
  );

  public static EMPLOYEE_TYPE_NOT_EXISTS: any = new NotFoundException(
    'Employee Type not exists',
  );
}
