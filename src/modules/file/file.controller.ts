import {
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { ApiFile } from 'src/utils/swagger.ext';
import { fileConfig } from '../../config/file.config';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';
import { FileRespDto } from './dto/response/file-resp.dto';
import { FileResponseCodes } from './file.response.codes';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('File')
export class FilesController {
  constructor(
    private fileService: FileService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Get file url by id' })
  @ApiResponse({ ...FileResponseCodes.SUCCESS, type: FileRespDto })
  @ApiResponse(FileResponseCodes.BAD_REQUEST)
  @ApiResponse(FileResponseCodes.INVALID_FILE_ID)
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FileRespDto> {
    return this.fileService.findFileById(id);
  }

  @ApiOperation({ summary: 'Upload a file' })
  @ApiFile()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', fileConfig))
  @ApiResponse(FileResponseCodes.BAD_REQUEST)
  @ApiResponse(FileResponseCodes.FILE_UNSUPPORTED)
  @ApiResponse(FileResponseCodes.FILE_EMPTY)
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  async uploadFile(@UploadedFile() uploadedFile): Promise<FileRespDto> {
    return await this.fileService.handleFileUpload(uploadedFile);
  }

  @ApiOperation({ summary: 'Download a video file' })
  @Get('getSignedVideoUrl/*')
  @Public()
  async viewVideofiles3(@Req() req, @Res() res) {
    let fileName = req.params[0];
    if (!fileName || fileName === '*') {
      throw new HttpException('Not a valid file.', HttpStatus.NOT_FOUND);
    }
    if (this.configService.get('DISK') === 's3') {
      // const fileName = req.params[0];
      const data = this.fileService.getSignedUrl(fileName);
      res.json({ body: data });
      return;
    } else {
      const options = {
        root: this.fileService.assetsBaseDirectory,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        },
      };
      return res.sendFile(fileName, options);
    }
  }

  @ApiOperation({ summary: 'Download a file' })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
  })
  @Get('download/*')
  @Public()
  async viewfile(@Req() req, @Res() res, @Query('name') name?: string) {
    const fileName = req.params[0];
    if (!fileName || fileName === '*') {
      throw new HttpException('Not a valid file.', HttpStatus.NOT_FOUND);
    }
    const downloadFileName = name || fileName;
    if (this.configService.get('DISK') === 's3') {
      const data = await this.fileService.downloadFile(fileName);
      res.attachment(downloadFileName); // Set Filename
      res.type(data?.ContentType); // Set FileType
      res.send(data?.Body);
      return;
    } else {
      const options = {
        root: this.fileService.assetsBaseDirectory,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        },
      };
      return res.sendFile(downloadFileName, options);
    }
  }

  @Get('stream/*')
  @Public()
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(@Headers() headers, @Req() req, @Res() res: Response) {
    const fileName = req.params[0];
    const videoPath = `${fileName}`;
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
    }
  }
}
