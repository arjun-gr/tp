import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class CollateralsResponseCodes extends AppResponseCodes {
  public static COLLATERALS_NOT_EXISTS: any = new BadRequestException(
    'Collaterals not exists',
  );
}
