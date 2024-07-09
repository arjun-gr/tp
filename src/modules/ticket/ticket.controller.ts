import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { TicketStatus } from '../../common/enums/ticket-status';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('Ticket')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @ApiOperation({ summary: 'Get all clients list for Admin' })
  @Get('client-list')
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'Search by name, optional',
    required: false,
  })
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getClientsListForAdmin(
    @AuthUser() user: User,
    @Query('search') search?: string,
  ) {
    return this.ticketService.getClientListByRole(user, search);
  }

  @ApiOperation({ summary: 'Get all ticket by pagination for admin' })
  @Get('ticket-list')
  @ApiQuery({
    name: 'status',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'month',
    type: 'Date',
    required: false,
    description: 'First date of the month (YYYY-MM-DD)',
  })
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getAllTicketsWithPaginationForAdmin(
    @AuthUser() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('status') status?: string,
    @Query('month') month?: Date,
  ) {
    return this.ticketService.getAllTicketsWithPagination(
      user,
      pageOptionsDto,
      status,
      month,
    );
  }

  @ApiOperation({ summary: 'Get Ticket Count for City op manager' })
  @Get('/city-op-manager/ticket-count')
  @Roles(Role.EMPLOYEE)
  getTicketCounts(@AuthUser() user: User) {
    return this.ticketService.getTicketCounts(user);
  }

  @ApiOperation({ summary: 'Get Ticket Type' })
  @Get('/ticket-type')
  getTicketType() {
    return this.ticketService.getTicketType();
  }

  @ApiOperation({ summary: 'Get Status list for Ticket' })
  @Get('/status')
  getTicketStatus() {
    return this.ticketService.getTicketStatus();
  }

  @ApiOperation({ summary: 'Get Ticket Details by id' })
  @Get('/:id')
  getTicketById(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.getTicketById(id);
  }

  @ApiOperation({ summary: 'Create Ticket for Client by Admin' })
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  createTicket(@AuthUser() user: User, @Body() dto: CreateTicketDto) {
    return this.ticketService.createTicket(user, dto);
  }

  @ApiOperation({ summary: 'Update Ticket for Client by Admin' })
  @Patch('/:id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  updateTicket(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicket(user, dto, id);
  }

  @ApiOperation({ summary: 'Update Ticket Status by City Op Manager' })
  @Patch('/status/:status/:id')
  @Roles(Role.EMPLOYEE)
  updateStatusByCityOpManager(
    @AuthUser() user: User,
    @Param('status') status: TicketStatus,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketService.updateStatusByCityOpManager(user, status, id);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
