import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { ServiceStatus, ServiceType } from '../../common/enums/services';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
@ApiTags('Services')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('/service-types')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getServiceType() {
    return this.servicesService.getServiceTypesList();
  }

  @Patch(':id/update-status')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  updateStatus(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateStatus(+id, updateServiceDto, user, null);
  }

  @Patch(':id/reschedule-service')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  rescheduleService(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.rescheduleService(+id, updateServiceDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @AuthUser() user: User,
  ) {
    return this.servicesService.updateServiceForm(+id, updateServiceDto, user);
  }

  @Get('/chart-history')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: ServiceStatus,
    required: false,
  })
  @ApiQuery({
    name: 'date',
    type: 'Date',
    required: false,
    description: 'Date format should be YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'month',
    type: 'Date',
    required: false,
    description: 'First date of the month (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'type',
    type: 'enum',
    enum: ServiceType,
    required: false,
  })
  getAllServicesForChart(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('city') city?: number,
    @Query('status') status?: ServiceStatus,
    @Query('date') date?: Date,
    @Query('month') month?: Date,
    @Query('type') type?: ServiceType,
  ) {
    return this.servicesService.getAllServicesForChart(
      user,
      pageOptionsDto,
      city,
      status,
      date,
      month,
      type,
    );
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: ServiceStatus,
    required: false,
  })
  @ApiQuery({
    name: 'date',
    type: 'Date',
    required: false,
    description: 'Date format should be YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'month',
    type: 'Date',
    required: false,
    description: 'First date of the month (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'type',
    type: 'enum',
    enum: ServiceType,
    required: false,
  })
  @ApiQuery({
    name: 'dashboardOrder',
    type: 'boolean',
    required: false,
    description: 'Date format should be YYYY-MM-DD',
  })
  findAll(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('city') city?: number,
    @Query('status') status?: ServiceStatus,
    @Query('date') date?: Date,
    @Query('month') month?: Date,
    @Query('type') type?: ServiceType,
    @Query('dashboardOrder') dashboardOrder?: boolean,
    @Query('upcomingServices') upcomingServices?: boolean,
  ) {
    return this.servicesService.findAll(
      user,
      pageOptionsDto,
      city,
      status,
      date,
      month,
      type,
      dashboardOrder,
      upcomingServices,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
