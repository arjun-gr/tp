import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from '../../app.response.codes';

export class BlogResponseCodes extends AppResponseCodes {
  public static BLOG_NOT_EXISTS: any = new BadRequestException(
    'Blog not exists',
  );
}
