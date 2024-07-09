import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as path from 'path';
import { rootDir } from '../../../root';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
@Controller('analytics')
@ApiTags('Analytics')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
@Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Get Impact Report list' })
  @Get()
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'startDate',
    type: 'Date',
    required: true,
    description: 'format should be (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'Date',
    required: true,
    description: 'format should be (YYYY-MM-DD)',
  })
  getImpactReportList(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('city') city?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.analyticsService.getAllImpactReports(
      user,
      pageOptionsDto,
      city,
      startDate,
      endDate,
    );
  }

  @ApiOperation({ summary: 'Get Impact Report' })
  @ApiQuery({
    name: 'branchId',
    type: Number,
    description: 'A parameter. Optional',
    required: false,
  })
  @Public()
  @Get('download-impact-report')
  async getImpactReport(
    @Res() res,
    @Query('clientId') clientId: number,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('branchId') branchId?: number,
  ) {
    const fileName = await this.analyticsService.getImpactReport({
      clientId,
      startDate,
      endDate,
      branchId,
    });
    const options = {
      root: path.join(rootDir(), this.configService.get('REPORT_FOLDER')),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    };
    return res.sendFile(fileName, options);
  }

  @Get('kpi')
  @ApiQuery({
    name: 'clientId',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'branchId',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'cityId',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'months',
    type: 'number',
    isArray: true,
    required: false,
  })
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async getKPIData(
    @AuthUser() user: User,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('clientId') clientId?: number,
    @Query('branchId') branchId?: number,
    @Query('cityId') cityId?: number,
  ) {
    return this.analyticsService.getDashboardAnalyticData({
      user,
      clientId,
      branchId,
      cityId,
      startDate,
      endDate,
    });
  }
}
