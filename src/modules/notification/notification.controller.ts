import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // @Get()
  // findAll() {
  //   return this.notificationService.findAll();
  // }

  @Get('')
  getNotificationsByUser(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.notificationService.findAllNotificationByUserId(
      user,
      pageOptionsDto,
    );
  }

  @Get(':id')
  fineOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  markNotificationAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markNotificationAsRead(id);
  }
}
