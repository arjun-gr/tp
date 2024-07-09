import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { Between, ILike, In, Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { NOTIFICATION_TYPES, Source } from '../../common/enums/notifications';
import { TicketStatus } from '../../common/enums/ticket-status';
import { TicketType, TicketTypes } from '../../common/enums/ticket-type';
import { UserType } from '../../common/enums/user-type';
import { Clients } from '../../entities/clients.entity';
import { File } from '../../entities/file.entity';
import { Ticket } from '../../entities/ticket.entity';
import { User } from '../../entities/user.entity';
import { ITicketNotificationPayload } from '../../interfaces/notifications';
import { checkValueExists } from '../../utils/app.utils';
import { getFirstAndLastDayOfMonth } from '../../utils/date.utils';
import {
  CLIENT_REPOSITORY,
  FILE_REPOSITORY,
  TICKET_REPOSITORY,
} from '../database/database.providers';
import { ProductService } from '../product/product.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketListResponse } from './dto/response/ticket-list.resp.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketResponseCodes } from './ticket.response.codes';

@Injectable()
export class TicketService {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private clientRepository: Repository<Clients>,
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: Repository<Ticket>,
    @Inject(FILE_REPOSITORY)
    private fileRepository: Repository<File>,
    private productService: ProductService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createTicket(createdBy: User, dto: CreateTicketDto) {
    // await this.productService.throwIfProductNotExists([dto.bin, dto.product]);
    const ticketType = this.checkTicketTypeValue(dto.type);
    // this.checkTicketPriorityValue(dto.priority);
    const ticket = plainToClass(Ticket, {
      ...dto,
      client: dto.clientId,
      branch: dto.branchId,
      city: dto.cityId,
      date: dto.date,
      type: dto.type,
      subject: dto.subject,
      description: dto.description,
      ticketStatus: TicketStatus.PLANNED,
      complaintCode: ticketType.ticketCode || '',
      createdBy,
    });
    if (dto.images) {
      const files = await this.fileRepository.find({
        where: { id: In(dto.images) },
      });

      ticket.images = files;
    }

    const ticketCreated = await this.ticketRepository.save(ticket);
    this.sendTicketNotification(createdBy, {
      ticketId: ticketCreated.id,
      status: TicketStatus.PLANNED,
      type: NOTIFICATION_TYPES.TICKET_RAISED,
      ticketType: dto.type as TicketType,
    });
    return {
      statusCode: 200,
      message: 'Ticket created Successfully',
    };
  }

  async updateTicket(updatedBy: User, dto: UpdateTicketDto, id: number) {
    // if (dto.priority) this.checkTicketPriorityValue(dto.priority);
    const ticket = new Ticket();

    if (dto.date) ticket.date = dto.date;
    if (dto.type) ticket.type = dto.type;
    if (dto.subject) ticket.subject = dto.subject;
    if (dto.product)
      ticket.product = await this.productService.throwIfProductNotExists(
        dto.product,
      );

    if (dto.description) ticket.description = dto.description || '';
    if (dto.ticket_status) ticket.ticketStatus = dto.ticket_status;
    if (dto.ticket_status == TicketStatus.COMPLETED) {
      ticket.completedAt = new Date();
      ticket.completedBy = updatedBy;
    }

    if (dto?.images?.length) {
      //[]
      const files = await this.fileRepository.find({
        where: { ticket: { id: id } },
      });
      const fileIds = files?.map((i: any) => i.id);

      const arr = fileIds?.filter((i: any) => !dto?.images.includes(i));
      if (arr?.length) {
        await this.fileRepository.delete({ id: In(arr) });
      }

      await this.fileRepository.update(
        { id: In(dto.images) },
        { ticket: { id: id } },
      );
    }
    if (
      [
        TicketStatus.COMPLETED,
        TicketStatus.CANCELLED,
        TicketStatus.PLANNED,
      ].includes(dto?.ticket_status)
    ) {
      this.sendTicketNotification(updatedBy, {
        ticketId: id,
        status: dto.ticket_status as TicketStatus,
        type: null,
        ticketType: dto.type as TicketType,
      });
    }

    return await this.ticketRepository.update({ id }, { ...ticket });
  }

  async updateStatusByCityOpManager(
    user: User,
    status: TicketStatus,
    ticketId: number,
  ) {
    const ticket = await this.throwIfTicketNotExists(ticketId);
    if (
      ticket.ticketStatus === TicketStatus.CANCELLED ||
      ticket.ticketStatus === TicketStatus.COMPLETED
    ) {
      throw TicketResponseCodes.TICKET_UPDATE_ACTION_DENIED;
    }
    let completedAt, completedBy;
    if (status == TicketStatus.COMPLETED) {
      completedAt = new Date();
      completedBy = user;
    }

    this.sendTicketNotification(user, {
      ticketId: ticketId,
      status: status as TicketStatus,
      type: null,
      ticketType: ticket.type as TicketType,
    });
    return await this.ticketRepository.update(ticketId, {
      ticketStatus: status,
      completedAt: completedAt,
      completedBy: completedBy,
    });
  }
  async remove(id: number) {
    await this.ticketRepository.update(id, { isActive: false });
    return this.ticketRepository.softDelete(id);
  }

  async getTicketById(ticketId: number) {
    const ticket = await this.throwIfTicketNotExists(ticketId, true);
    return ticket;
  }

  async getTicketCounts(user: User) {
    const ticketCount = await this.getTicketCount({
      clientId: user['clientId'],
      branchId: user['branchId'],
      cityIds: user['cityIds'],
    });
    const onGoingCount = ticketCount.filter(
      (i) => i.ticketStatus == TicketStatus.PLANNED,
    );
    const completedCount = ticketCount.filter(
      (i) => i.ticketStatus == TicketStatus.COMPLETED,
    );
    return {
      total: ticketCount.length,
      onGoingCount: onGoingCount.length,
      completedCount: completedCount.length,
    };
  }

  private async throwIfTicketNotExists(id: number, relations?: boolean) {
    const relation = relations
      ? {
          client: true,
          branch: true,
          city: {
            users: true,
          },
          // createdBy: true,
          product: true,
          images: true,
        }
      : null;

    const where = { id, isActive: true };
    const select = relations
      ? {
          product: {
            id: true,
            name: true,
          },
        }
      : {};
    const ticket = await this.ticketRepository.findOne({
      where,
      relations: relation,
      // select: select,
    });
    if (!ticket) throw TicketResponseCodes.TICKET_NOT_EXISTS;
    return ticket;
  }

  private checkTicketTypeValue(type: string) {
    const result: any = checkValueExists(TicketTypes, type);
    if (!result) throw TicketResponseCodes.TICKET_TYPE_NOT_EXISTS;
    return result;
  }

  async getClientListByRole(user: User, search: string) {
    let where: any = {};
    where['isActive'] = true;
    where['branches'] = { isActive: true };
    if (search && search.trim().length > 0) {
      where['name'] = ILike(`%${search}%`);
    }
    if (
      user.userType == UserType.Employee ||
      user.userType == UserType.Client
    ) {
      const userCities = user?.cities?.map((i) => i.id);
      where['branches'] = {
        ...where['branches'],
        city: { id: In(userCities) },
      };
    }
    const clients = await this.clientRepository.find({
      where,
      relations: {
        branches: {
          city: true,
        },
      },
    });
    return clients;
  }

  async getAllTicketsWithPagination(
    user: User,
    pageOptionsDto: PageOptionsDto,
    status: string,
    month: Date,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    let dateFilter = null;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = user['cityIds'] || null;
    if (month) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);
      dateFilter = Between(firstDay, lastDay);
    }
    const baseConditions = {
      isActive: true,
      ticketStatus: status,
      date: dateFilter,
      client: { id: clientId },
      branch: { id: branchId },
      city: { id: In(cityIds) },
    };
    let where: any =
      search && search?.trim()?.length > 0
        ? [
            {
              ...baseConditions,
              client: { ...baseConditions.client, name: ILike(`%${search}%`) },
            },
            {
              ...baseConditions,
              branch: { ...baseConditions.branch, name: ILike(`%${search}%`) },
            },
            {
              ...baseConditions,
              complaintCode: ILike(`%${search}%`),
            },
          ]
        : baseConditions;

    if (where.length) {
      where.forEach(function (v) {
        if (status == undefined) delete v.ticketStatus;
        if (!dateFilter) delete v.date;
        if (!cityIds?.length) delete v.city;
        if (!clientId) delete v.client.id;
        if (!branchId) delete v.branch.id;
      });
    } else {
      if (status == undefined) delete where.ticketStatus;
      if (!dateFilter) delete where.date;
      if (!cityIds?.length) delete where.city;
      if (!clientId) delete where.client;
      if (!branchId) delete where.branch;
    }

    const [list, count] = await this.ticketRepository.findAndCount({
      where,
      relations: {
        client: true,
        branch: {
          city: true,
        },
        city: true,
        product: true,
      },
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    const finalList: TicketListResponse[] = list.map(
      (i) => new TicketListResponse(i),
    );
    return new PageDto(finalList, pageMetaDto);
  }

  getTicketType() {
    return TicketTypes;
  }

  getTicketStatus() {
    return Object.keys(TicketStatus).map((i) => {
      return {
        id: TicketStatus[i],
        name: TicketStatus[i],
      };
    });
  }

  async getTicketCount(obj: any) {
    const { clientId, cityIds, branchId } = obj;
    let where = {};
    if (clientId) {
      where['client'] = { id: clientId };
    }
    if (branchId) {
      where['branch'] = { id: branchId };
    }
    if (cityIds?.length) {
      where['city'] = { id: In(cityIds) };
    }
    where['isActive'] = true;
    return this.ticketRepository.find({
      where,
      select: { id: true, ticketStatus: true },
    });
  }

  sendTicketNotification(user: User, payload: ITicketNotificationPayload) {
    const { status } = payload;
    const notificationType =
      status == TicketStatus.COMPLETED
        ? NOTIFICATION_TYPES.TICKET_COMPLETED
        : status == TicketStatus.CANCELLED
          ? NOTIFICATION_TYPES.TICKET_CANCELLED
          : NOTIFICATION_TYPES.TICKET_UPDATED;
    payload.type = notificationType;
    this.eventEmitter.emit(Events.NOTIFICATION_CREATED, {
      data: {
        from: user,
        notification: null,
        title: null,
        extraParams: null,
        data: {
          ticket: payload,
        },
        source: Source.CUSTOMER_CARE,
      },
    });
  }
}
