import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AwarenessCampStatus } from '../../common/enums/awareness-camp';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AwarenessCampService } from './awareness_camp.service';
import { CreateAwarenessCampDto } from './dto/create-awareness_camp.dto';
import { UpdateAwarenessCampDto } from './dto/update-awareness_camp.dto';

@Controller('awareness-camp')
@ApiTags('Awareness-camp')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class AwarenessCampController {
  constructor(private readonly awarenessCampService: AwarenessCampService) {}

  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  @Post()
  create(
    @AuthUser() user: User,
    @Body() createAwarenessCampDto: CreateAwarenessCampDto,
  ) {
    return this.awarenessCampService.create(createAwarenessCampDto, user);
  }

  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: AwarenessCampStatus,
    required: false,
  })
  @Get()
  findAll(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('status') status: AwarenessCampStatus,
  ) {
    return this.awarenessCampService.getAwarenessList(
      user,
      pageOptionsDto,
      status,
    );
  }

  @Get('status-list')
  getAllStatus(@AuthUser() user: User) {
    return this.awarenessCampService.statusList(user);
  }

  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awarenessCampService.findOne(+id);
  }

  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateAwarenessCampDto: UpdateAwarenessCampDto,
  ) {
    return this.awarenessCampService.update(user, +id, updateAwarenessCampDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.awarenessCampService.remove(user, +id);
  }
}
