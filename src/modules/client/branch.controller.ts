import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseCodes } from '../users/user.response.codes';
import { BranchService } from './branch.service';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDetailDto } from './dto/update-client-detail.dto';
import { PurchaseService } from './purchase.service';

@Controller('branch')
@ApiTags('Branch Management')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(
    private readonly clientService: ClientService,
    private branchService: BranchService,
    private purchaseService: PurchaseService,
  ) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  addBranch(@Body() dto: CreateClientDto) {
    return this.branchService.addBranch(dto);
  }

  @ApiOperation({ summary: 'Update client and branch details' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Patch()
  @Roles(Role.SUPER_ADMIN)
  updateBranch(@Body() dto: UpdateClientDetailDto) {
    return this.clientService.updateClientAndBranch(dto);
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
  @Get('list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT)
  getBranchList(
    @Query('clientId') clientId: number,
    @Query('cityId') cityId: number,
    @Query('branchId') branchId: number,
  ) {
    return this.branchService.getBranchList(clientId, cityId, branchId);
  }

  @ApiOperation({ summary: 'Get all purchase for branch' })
  @Get(':id/purchase-list')
  @Roles(Role.SUPER_ADMIN)
  getPurchaseListByBranchId(@Param('id') branchId: number) {
    return this.purchaseService.getPurchaseList(branchId);
  }

  @ApiOperation({ summary: 'Get Branch by Id' })
  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  getBranchDetails(@Param('id') id: number) {
    return this.branchService.getBranchDetails(id);
  }

  @ApiOperation({ summary: 'Get Product of Branch by Id' })
  @Get(':id/product')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getProductByBranch(@Param('id') id: number) {
    return this.branchService.getProductListByBranch(id);
  }

  @ApiOperation({ summary: 'Toggle Branch active status by branchId' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Patch(':id/active/:status')
  setBranchActive(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) branchId: number,
    @Param('status', ParseBoolPipe) status: boolean,
    @Query('reason') reason?: string,
  ) {
    return this.branchService.toggleBranchActive(
      branchId,
      status,
      user,
      reason,
    );
  }

  @ApiOperation({ summary: 'Get Total Units of Branch by Id' })
  @Get(':id/total-units')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT)
  getTotalUnitByBranch(@Param('id') id: number) {
    return this.purchaseService.getTotalUnitByBranch(id);
  }

  @ApiOperation({ summary: 'delete Branch by Id' })
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deleteBranch(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Query('reason') reason?: string,
  ) {
    return this.branchService.deleteBranch(user, id, reason);
  }
}
