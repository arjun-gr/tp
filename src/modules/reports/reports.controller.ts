/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { rootDir } from '../../../root';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { Public } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Admin Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private configService: ConfigService,
  ) {}

  @Get('/recycle-certificates-list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'month',
    type: 'Date',
    required: false,
    description: 'First date of the month (YYYY-MM-DD)',
  })
  async getRecycleList(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('city') city?: number,
    @Query('month') month?: Date,
  ) {
    return this.reportsService.getRecycleCertificates(
      user,
      pageOptionsDto,
      city,
      month,
    );
  }

  @Get('/service-card-list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'month',
    type: 'Date',
    required: false,
    description: 'First date of the month (YYYY-MM-DD)',
  })
  async getServiceCardList(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('reportType') reportType: string,
    @Query('city') city?: number,
    @Query('month') month?: Date,
  ) {
    return this.reportsService.getAllServiceCardsAndInvoices(
      user,
      pageOptionsDto,
      city,
      month,
      reportType,
    );
  }

  @Get('/download-recycle-certificate')
  @Public()
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async getRecycleCertificate(
    @Res() res,
    @Query('serviceId') serviceId: number,
  ) {
    const path = require('path');
    const fileName =
      await this.reportsService.getRecyclingCertificate(serviceId);
    if (fileName) {
      const options = {
        root: path.join(
          rootDir(),
          this.configService.get('RECYCLING_CERTIFICATE_FOLDER'),
        ),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        },
      };
      return res.download(fileName, options);
    }
    return res.send();
  }
}
