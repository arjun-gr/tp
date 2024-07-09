import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class CityResponseCodes extends AppResponseCodes {
  public static CITY_EXISTS: any = new BadRequestException(
    'city already exists',
  );

  public static CITY_NOT_EXISTS: any = new NotFoundException('city not exists');
}
