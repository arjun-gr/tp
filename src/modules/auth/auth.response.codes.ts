import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class AuthResponseCodes extends AppResponseCodes {
  public static USER_CREDENTIALS_INVALID: any = new BadRequestException(
    'Credentials are invalid',
  );

  public static USER_ACCOUNT_INACTIVE: any = new ForbiddenException(
    'Account is inactive',
  );

  public static USER_ACCOUNT_INVALID: any = new NotFoundException(
    'Invalid user account',
  );

  public static ACCESS_TOKEN_INVALID: any = new UnauthorizedException(
    'Invalid access token',
  );

  public static CITY_NOT_ASSIGNED: any = new ForbiddenException(
    'Waiting Admin to assign a cities responsibility to you. Please coordinate with Admin.',
  );

  public static BRANCH_NOT_EXISTS: any = new ForbiddenException(
    'Contact admin seems to have some issues with your account.',
  );
}
