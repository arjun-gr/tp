import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { rootDir } from 'root';
import { CryptoService } from 'src/providers/crypto.service';
import { REGEX } from 'src/utils/file.utils';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import { FILE_REPOSITORY } from '../database/database.providers';
import { FileRespDto } from './dto/response/file-resp.dto';
import { FileResponseCodes } from './file.response.codes';

@Injectable()
export class FileService {
  s3Instance: S3;
  constructor(
    @Inject(FILE_REPOSITORY)
    private fileRepository: Repository<File>,
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {}

  get instanceS3(): S3 {
    if (this.configService.get('DISK') === 's3' && !this.s3Instance) {
      this.s3Instance = new S3({
        region: this.configService.get('AWS_REGION'),
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      });
    }
    return this.s3Instance;
  }

  // async handleFileUpload(uploadedFile: any): Promise<FileRespDto> {
  //   if (uploadedFile == null) {
  //     throw FileResponseCodes.FILE_EMPTY;
  //   }

  //   const destination: string = this.getFileDestination(uploadedFile);

  //   let file: File = this.getFileEntity(uploadedFile, destination);
  //   this.moveFileToDestination(uploadedFile, destination, file);
  //   file = await this.fileRepository.save(file);

  //   const fileRespDto: FileRespDto = new FileRespDto(file);
  //   return fileRespDto;
  // }

  async handleFileUpload(uploadedFile: any): Promise<FileRespDto> {
    try {
      if (uploadedFile == null) {
        throw FileResponseCodes.FILE_EMPTY;
      }
      const destination: string = this.getFileDestination(uploadedFile);

      const disk = this.configService.get('DISK');
      let uploadResult;
      let file: File;
      if (disk === 's3') {
        const fileData = await fs.readFileSync(uploadedFile.path, {});
        const key = `${destination}/${uploadedFile.filename}.${mime.extension(
          uploadedFile.mimetype,
        )}`;
        uploadResult = await this.instanceS3
          .upload({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Body: fileData,
            Key: key,
          })
          .promise();
        file = this.getFileEntity(uploadedFile, uploadResult.Key);
        this.deleteFileFromLocal(uploadedFile);
      } else {
        file = this.getFileEntity(uploadedFile, destination);
        this.moveFileToDestination(uploadedFile, destination, file);
      }

      file = await this.fileRepository.save(file);

      const fileRespDto: FileRespDto = new FileRespDto(file);
      return fileRespDto;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async findFileById(id: unknown): Promise<FileRespDto> {
    const file: File = await this.fileRepository.findOne(id);

    if (file == null) {
      throw FileResponseCodes.INVALID_FILE_ID;
    }

    const fileRespDto: FileRespDto = new FileRespDto(file);
    return fileRespDto;
  }

  private getFileDestination(uploadedFile: any): string {
    if (uploadedFile.mimetype.match(REGEX.ALLOWED_IMAGE_FILE_EXTENSIONS)) {
      return 'images';
    } else if (
      uploadedFile.mimetype.match(REGEX.ALLOWED_VIDEO_FILE_EXTENSIONS)
    ) {
      return 'videos';
    } else {
      return 'file';
    }
  }

  public get assetsBaseDirectory(): string {
    return path.join(rootDir(), this.configService.get('UPLOADS_FOLDER_PATH'));
  }

  private moveFileToDestination(
    uploadedFile: any,
    destination: string,
    fileEntity: File,
  ): void {
    const dir = path.join(this.assetsBaseDirectory, destination);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.copyFileSync(uploadedFile.path, path.join(dir, fileEntity.name));
    fs.unlinkSync(uploadedFile.path);
  }

  public async copyAndSaveFile(file: File): Promise<File> {
    const dir = path.join(
      this.assetsBaseDirectory,
      this.getFileDestination(file),
    );
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const copyFilename: string =
      this.cryptoService.generateRandomString() + '.' + file.name.split('.')[1];

    fs.copyFileSync(path.join(dir, file.name), path.join(dir, copyFilename));

    const fileCopy: File = new File();
    Object.assign(fileCopy, file);
    fileCopy.id = null;
    fileCopy.createdAt = new Date();
    fileCopy.updatedAt = new Date();
    fileCopy.name = copyFilename;
    fileCopy.url = path.join(this.getFileDestination(file), copyFilename);

    await this.fileRepository.save(fileCopy);

    return fileCopy;
  }

  private getFileEntity(uploadedFile: any, destination: string): File {
    const file: File = new File();
    const extension = mime.extension(uploadedFile.mimetype);
    file.originalName = uploadedFile.originalname;
    file.mimetype = uploadedFile.mimetype;
    file.size = uploadedFile.size;
    file.name = `${uploadedFile.filename}.${extension}`;
    file.url =
      this.configService.get('DISK') === 's3'
        ? destination
        : path.join(destination, file.name);
    // file.url = path.join(destination, file.name);
    file.disk = this.configService.get('DISK');

    return file;
  }

  private getExtention(fileName: string) {
    const i = fileName?.lastIndexOf('.');
    if (i == -1) {
      return 'mp4';
    }
    return fileName?.slice(i + 1);
  }

  private deleteFileFromLocal(uploadedFile: any): void {
    try {
      fs.rmSync(uploadedFile.path);
    } catch (e) {}
  }

  public async downloadFile(key: string): Promise<any> {
    const options = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    };
    try {
      const fileStream = await this.instanceS3.getObject(options).promise();
      return fileStream;
    } catch (err) {
      console.log(err);
    }
  }

  public getSignedUrl(key: string) {
    const presignedGETURL = this.instanceS3.getSignedUrl('getObject', {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
      Expires: 300000, //time to expire in seconds
    });

    return presignedGETURL;
  }
}
