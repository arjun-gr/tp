import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { REGEX } from 'src/utils/file.utils';
import { FileResponseCodes } from 'src/modules/file/file.response.codes';
import { dskStorage } from './disk-storage.config';

export const fileConfig: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS) ||
      file.mimetype.match(REGEX.ALLOWED_VIDEO_FILE_EXTENSIONS) ||
      file.mimetype.match(REGEX.ALLOWED_FILE_EXTENSIONS)
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new BadRequestException(
          FileResponseCodes.FILE_UNSUPPORTED.description +
            ' ' +
            extname(file.originalname),
        ),

        false,
      );
    }
  },
  // Storage properties
  storage: dskStorage,
};
