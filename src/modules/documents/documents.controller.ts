import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@ApiTags('documents')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'date',
    type: 'Date',
    required: false,
    description: 'Date format should be YYYY-MM-DD',
  })
  findAll(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('city') city?: number,
    @Query('date') date?: Date,
  ) {
    return this.documentsService.findAll(user, pageOptionsDto, city, date);
  }
}
