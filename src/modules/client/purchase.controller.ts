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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseCodes } from '../users/user.response.codes';
import { BranchContractRequestDto } from './dto/branch-new-request.dto';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
@ApiTags('Contract Management')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @ApiOperation({ summary: 'Get all purchase for branch' })
  @Get('list')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE)
  getAllPurchase(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('branch') branch?: number,
  ) {
    return this.purchaseService.getAllPurchase(pageOptionsDto, branch);
  }

  @ApiOperation({ summary: 'Get all purchase for branch' })
  @Get('purchase-list')
  @Roles(Role.SUPER_ADMIN)
  getPurchaseListByBranchId(@Query('branchId') branchId: number) {
    return this.purchaseService.getPurchaseList(branchId);
  }

  @ApiOperation({ summary: 'Get Purchase by Id' })
  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getPurchaseDetailsById(@Param('id') id: number) {
    return this.purchaseService.getPurchaseDetailsById(id);
  }

  @ApiOperation({ summary: 'contract re-new request' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Post('renew-contract')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE)
  contractRenewalRequest(
    @AuthUser() user: User,
    @Body() dto: BranchContractRequestDto,
  ) {
    return this.purchaseService.contractRenewalRequest(dto, user);
  }

  @ApiOperation({ summary: 'contract new request' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Post('new-contract')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE)
  contractNewRequest(
    @AuthUser() user: User,
    @Body() dto: BranchContractRequestDto,
  ) {
    return this.purchaseService.contractNewRequest(null,dto,null, user);
  }

  @ApiOperation({ summary: 'update contract' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  updateContract(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) purchaseId: number,
    @Body() dto: BranchContractRequestDto,
  ) {
    return this.purchaseService.updateContract(purchaseId, user, dto);
  }

  @ApiOperation({ summary: 'Toggle Branch active status by branchId' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Patch(':id/active/:status')
  @Roles(Role.SUPER_ADMIN)
  setContractActive(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) purchaseId: number,
    @Param('status', ParseBoolPipe) status: boolean,
    @Query('reason') reason?: string,
  ) {
    return this.purchaseService.togglePurchaseActive(
      purchaseId,
      status,
      user,
      reason,
    );
  }

  @ApiOperation({ summary: 'Toggle Branch active status by branchId' })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deleteContract(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) purchaseId: number,
    @Query('reason') reason?: string,
  ) {
    return this.purchaseService.deleteContract(user, purchaseId, reason);
  }
}
