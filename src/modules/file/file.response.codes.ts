import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class FileResponseCodes extends AppResponseCodes {
  public static FILE_UNSUPPORTED: any = new BadRequestException(
    'Unsupported file type',
  );

  public static FILE_EMPTY: any = new NotFoundException('file missing');

  public static INVALID_FILE_ID: any = new NotFoundException('invalid file id');
}
