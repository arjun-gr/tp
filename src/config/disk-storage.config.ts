import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const dskStorage = diskStorage({
  // Destination storage path details
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = process.env.UPLOADS_FOLDER_PATH;
    // Create folder if doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  // File modification details
  // filename: (req: any, file: any, cb: any) => {
  // Calling the callback passing the random name generated with the original extension name
  // cb(null, `${uuid()}${extname(file.originalname)}`);
  // },
});
