import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class StateResponseCodes extends AppResponseCodes {
  public static EXITS: any = new BadRequestException('State Already Exist');
}
