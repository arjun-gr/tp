import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoService } from './video.service';

@Controller('video')
@ApiTags('Video')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private videoService: VideoService) {}

  @ApiOperation({ summary: 'Get all videos' })
  @Get('/video-list')
  getAllVideoByPagination(@Query() pageOptionsDto: PageOptionsDto) {
    return this.videoService.getAllVideoByPagination(pageOptionsDto);
  }

  @ApiOperation({ summary: 'Get Video Details by id' })
  @Get('/:id')
  getTicketById(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.getVideoById(id);
  }

  @ApiOperation({ summary: 'Create Video' })
  @Post()
  @Roles(Role.SUPER_ADMIN)
  createVideo(@Request() req: any, @Body() dto: CreateVideoDto) {
    const userId = req.user.id;
    return this.videoService.createVideo(dto, userId);
  }

  @ApiOperation({ summary: 'update Video' })
  @Patch('/:id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVideoDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.videoService.updateVideo(id, dto, userId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
