import { ForbiddenException } from '@nestjs/common';
import { AppResponseCodes } from '../app.response.codes';

export class AuthorizationResponseCodes extends AppResponseCodes {
  public static ACCESS_DENIED: any = new ForbiddenException('access_denied');
}
