import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { EmployeeType } from '../../common/enums/employee-type';
import { Role } from '../../common/enums/roles';
import { Status } from '../../common/enums/status';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseCodes } from './user.response.codes';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User Management')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('employee')
  createEmployee(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createEmployee(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get city-manager list' })
  @Get('city-managers')
  getCityManagers(@AuthUser() user: User) {
    return this.usersService.getCityManagers(user);
  }

  @ApiOperation({ summary: 'Get city-manager by cityId' })
  @Get('city-managers/:cityId')
  getCityManagerList(@Param('cityId') cityId: number) {
    return this.usersService.getCityManagerList(cityId);
  }

  @ApiQuery({
    name: 'employeeType',
    type: 'enum',
    enum: EmployeeType,
    required: false,
  })
  @ApiQuery({
    name: 'city',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: Status,
    required: false,
  })
  @ApiOperation({ summary: 'Get employee list' })
  @Get('employee')
  async getEmployeeList(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('status') status: boolean,
    @Query('employeeType') userType?: EmployeeType,
    @Query('city') city?: number,
  ) {
    return this.usersService.getEmployees(
      pageOptionsDto,
      userType,
      status,
      city,
    );
  }

  @ApiOperation({ summary: 'Get employee detail by userId' })
  @Get('employee/:userId')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getEmployeeById(@Param('userId') id: number) {
    return this.usersService.getEmployeeByUserId(id);
  }

  @ApiOperation({ summary: 'Get all clients list' })
  @Get('branch-list/:clientId')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getBranchListById(@Param('clientId') clientId: string) {
    return this.usersService.getBranchList(parseInt(clientId));
  }

  @ApiOperation({ summary: 'Get city op manager detail by userId and cityId' })
  @Get(':userId/city/:cityId')
  @Roles(Role.SUPER_ADMIN, Role.EMPLOYEE, Role.CLIENT)
  getCityOpManagerDetailsByCity(
    @Param('userId') userId: number,
    @Param('cityId') cityId: number,
  ) {
    return this.usersService.getCityOpManagerDetailsByCity(userId, cityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'update employee by userId' })
  @Patch('employee/:userId')
  update(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateEmployee(+id, updateUserDto);
  }

  // @ApiOperation({ summary: 'update client by id' })
  // @Patch('client/:id')
  // updateClient(
  //   @Param('id') id: string,
  //   @Body() updateClientDto: UpdateClientDto,
  // ) {
  //   return this.usersService.update(+id, updateClientDto);
  // }

  @ApiOperation({ summary: "Toggle user's active status" })
  @ApiResponse(UserResponseCodes.SUCCESS)
  @ApiResponse(UserResponseCodes.BAD_REQUEST)
  @ApiResponse(UserResponseCodes.INVALID_USER_ID)
  @HttpCode(200)
  @Patch(':id/active/:status')
  setUserActive(
    @Param('id', ParseIntPipe) userId: number,
    @Param('status', ParseBoolPipe) status: boolean,
  ) {
    return this.usersService.toggleUserActive(userId, status);
  }

  // @Post('client')
  // createClient(@Body() createClientDto: CreateClientDto) {
  //   return this.usersService.createClient(createClientDto);
  // }

  // @ApiOperation({ summary: 'Toggle Branch active status by branchId' })
  // @ApiResponse(UserResponseCodes.SUCCESS)
  // @ApiResponse(UserResponseCodes.BAD_REQUEST)
  // @Patch('client/branch/:branchId/active/:status')
  // setBranchActive(
  //   @Param('branchId', ParseIntPipe) branchId: number,
  //   @Param('status', ParseBoolPipe) status,
  // ) {
  //   return this.branchService.toggleBranchActive(branchId, status);
  // }

  @ApiOperation({ summary: 'Set Username and password' })
  @Patch('set-password')
  setUsernameAndPassword(@Body() setUsernameAndPassword: SetPasswordDto) {
    return this.usersService.setClientUsernameAndPassword(
      setUsernameAndPassword,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'delete employee by userId' })
  @Delete('employee/:userId')
  removeEmployee(@Param('userId') id: number) {
    return this.usersService.deleteEmployee(id);
  }

  // @ApiOperation({ summary: 'Soft delete client by userId' })
  // @Delete('client/:userId')
  // deleteClient(@Param('userId') id: number) {
  //   return this.usersService.deleteClient(id);
  // }
}
