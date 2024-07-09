import { NotFoundException } from '@nestjs/common';

export class NotificationResponseCodes {
  public static INVALID__NOTIFICATION: any = new NotFoundException(
    'invalid notification id',
  );
}
