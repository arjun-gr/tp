import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ClientTypes } from '../../common/enums/client';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('client')
@ApiTags('Client Management')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiQuery({
    name: 'clientType',
    type: 'enum',
    enum: ClientTypes,
    required: false,
  })
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: 'string',
    required: false,
  })
  @ApiOperation({ summary: 'Get all clients' })
  @Get('client')
  @Roles(Role.SUPER_ADMIN)
  getAllClientsList(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('clientType') clientType?: ClientTypes,
    @Query('city') city?: number,
    @Query('status') status?: string,
  ) {
    return this.clientService.getAllClients(
      pageOptionsDto,
      clientType,
      city,
      status,
    );
  }

  @ApiOperation({ summary: 'Get all clients list' })
  @Get('client-list')
  @ApiQuery({
    name: 'clientName',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'isDirectClient',
    type: 'boolean',
    required: false,
  })
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getClientsList(
    @AuthUser() user: User,
    @Query('clientName') clientName?: string,
    @Query('isDirectClient') isDirectClient?: boolean,
  ) {
    return this.clientService.getClients(user, clientName, isDirectClient);
  }

  @ApiOperation({ summary: 'Get all clients type list' })
  @Get('client-type')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getClientTypes() {
    return this.clientService.getClientTypeList();
  }

  @ApiOperation({ summary: 'Get all industry-type list' })
  @Get('industry-list')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getIndustryList() {
    return this.clientService.getIndustryList();
  }

  @ApiOperation({
    summary: 'Get Client City list  by clientId and cityId or branchId',
  })
  @ApiQuery({
    name: 'clientId',
    type: 'number',
    required: true,
  })
  @ApiQuery({
    name: 'cityId',
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
  @ApiOperation({ summary: 'Get Analytics of by client Id' })
  @Get(':id/analytics')
  @Roles(Role.SUPER_ADMIN)
  getAnalyticByClientId(
    @Param('id') id: number,
    @Query('cityId') cityId?: number,
    @Query('branchId') branchId?: number,
  ) {
    return this.clientService.getAnalyticByClientId(id, cityId, branchId);
  }

  @ApiOperation({ summary: 'Get Client by Id and City Id' })
  @Get('/:id')
  @Roles(Role.SUPER_ADMIN)
  getClientListByClientId(@Param('id') id: number) {
    return this.clientService.getClientDetailsById(id, null);
  }

  @ApiOperation({ summary: 'Get Client by Id and City Id' })
  @Get('/:id/city/:cityId')
  @Roles(Role.SUPER_ADMIN)
  getClientListByClientAndCityId(
    @Param('id') id: number,
    @Param('cityId') cityId: number,
  ) {
    return this.clientService.getClientDetailsById(id, cityId);
  }

  @ApiOperation({ summary: 'Get Client City list  by clientId' })
  @Get('/:id/city-list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT)
  getCityList(@Param('id') id: number) {
    return this.clientService.getCityListById(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }
}
