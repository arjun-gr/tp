import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class CountryResponseCodes extends AppResponseCodes {
  public static EXITS: any = new BadRequestException('Country Already Exist');
}
