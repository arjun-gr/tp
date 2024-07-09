import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class VideoResponseCodes extends AppResponseCodes {
  public static VIDEO_NOT_EXISTS: any = new BadRequestException(
    'Video not exists',
  );
}
