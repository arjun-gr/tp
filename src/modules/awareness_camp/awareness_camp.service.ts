import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILike, In, Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import {
  AwarenessCampClientStatus,
  AwarenessCampEmployeeType,
  AwarenessCampStatus,
  AwarenessCampStatusList,
} from '../../common/enums/awareness-camp';
import { NOTIFICATION_TYPES, Source } from '../../common/enums/notifications';
import { AwarenessCamp } from '../../entities/awareness-camp.entity';
import { User } from '../../entities/user.entity';
import { ICampNotificationPayload } from '../../interfaces/notifications';
import { checkValueExists } from '../../utils/app.utils';
import { AWARENESS_CAMP } from '../database/database.providers';
import { AwarenessCampResponseCodes } from './awareness-camp.response.code';
import { CreateAwarenessCampDto } from './dto/create-awareness_camp.dto';
import { UpdateAwarenessCampDto } from './dto/update-awareness_camp.dto';

@Injectable()
export class AwarenessCampService {
  constructor(
    @Inject(AWARENESS_CAMP)
    private awarenessCampRepository: Repository<AwarenessCamp>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(
    createAwarenessCampDto: CreateAwarenessCampDto,
    createdBy: User,
  ) {
    this.checkAwarenessCampEmpType(createAwarenessCampDto.type);
    let awarenessCamp = this.awarenessCampRepository.create({
      client: {
        id: createAwarenessCampDto.clientId,
      },
      branch: {
        id: createAwarenessCampDto.branchId,
      },
      city: {
        id: createAwarenessCampDto.cityId,
      },
      type: createAwarenessCampDto.type,
      email: createAwarenessCampDto.email,
      phoneNumber: createAwarenessCampDto.phoneNumber,
      noOfEmployee: createAwarenessCampDto.noOfEmployee,
      eventDate: createAwarenessCampDto.eventDate,
      status: AwarenessCampStatus.PLANNED,
      clientStatus: AwarenessCampClientStatus.OPEN,
      createdBy: createdBy,
    });
    const camp = await this.awarenessCampRepository.save(awarenessCamp);
    this.sendNotification(createdBy, {
      awarenessCampId: camp.id,
      status: createAwarenessCampDto.status as AwarenessCampStatus,
      clientStatus: null,
      type: NOTIFICATION_TYPES.AWARENESSCAMP_PLANNED,
    });
    return {
      statusCode: 200,
      message: 'Awareness camp created Successfully',
      data: camp,
    };
  }

  findOne(id: number) {
    return this.awarenessCampRepository.findOne({
      where: { id },
      relations: { client: true, branch: true, city: true },
      select: {
        id: true,
        client: { id: true, name: true },
        branch: { id: true, name: true },
        city: { id: true, name: true },
        phoneNumber: true,
        noOfEmployee: true,
        type: true,
        eventDate: true,
        status: true,
        clientStatus: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  update(
    user: User,
    id: number,
    updateAwarenessCampDto: UpdateAwarenessCampDto,
  ) {
    if (updateAwarenessCampDto.type)
      this.checkAwarenessCampEmpType(updateAwarenessCampDto.type);
    let camp = this.awarenessCampRepository.findOne({
      where: { id },
    });
    if (!camp) throw AwarenessCampResponseCodes.AWARENESS_CAMP_NOT_EXISTS;
    switch (updateAwarenessCampDto.status) {
      // case AwarenessCampStatus.ON_GOING:
      case AwarenessCampStatus.PLANNED:
        this.sendNotification(user, {
          awarenessCampId: id,
          status: updateAwarenessCampDto.status as AwarenessCampStatus,
          clientStatus: AwarenessCampClientStatus.OPEN,
          type: NOTIFICATION_TYPES.AWARENESSCAMP_PLANNED,
        });
        return this.awarenessCampRepository.update(id, {
          status: updateAwarenessCampDto.status,
          clientStatus: AwarenessCampClientStatus.OPEN,
        });
      case AwarenessCampStatus.COMPLETED:
        this.sendNotification(user, {
          awarenessCampId: id,
          status: updateAwarenessCampDto.status as AwarenessCampStatus,
          clientStatus: AwarenessCampClientStatus.RESOLVED,
          type: NOTIFICATION_TYPES.AWARENESSCAMP_COMPLETED,
        });
        return this.awarenessCampRepository.update(id, {
          status: updateAwarenessCampDto.status,
          completedBy: user,
          clientStatus: AwarenessCampClientStatus.RESOLVED,
        });
      case AwarenessCampStatus.CANCELLED:
      case AwarenessCampStatus.REJECT:
        this.sendNotification(user, {
          awarenessCampId: id,
          status: updateAwarenessCampDto.status as AwarenessCampStatus,
          clientStatus: AwarenessCampClientStatus.CLOSED,
          type: NOTIFICATION_TYPES.AWARENESSCAMP_REJECT,
        });
        return this.awarenessCampRepository.update(id, {
          status: updateAwarenessCampDto.status,
          clientStatus: AwarenessCampClientStatus.CLOSED,
        });
    }
  }

  async remove(user: User, id: number) {
    let camp = await this.awarenessCampRepository.findOne({
      where: { id },
    });
    if (!camp) throw AwarenessCampResponseCodes.AWARENESS_CAMP_NOT_EXISTS;
    this.sendNotification(user, {
      awarenessCampId: id,
      status: AwarenessCampStatus.CANCELLED,
      clientStatus: AwarenessCampClientStatus.CLOSED,
      type: NOTIFICATION_TYPES.AWARENESSCAMP_DELETED,
    });
    return this.awarenessCampRepository.softDelete(id);
  }

  statusList(user: User) {
    return AwarenessCampStatusList;
  }

  async getAwarenessList(
    user: User,
    pageOptionsDto: PageOptionsDto,
    status: string,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = user['cityIds'] || null;
    const baseConditions = {
      isActive: true,
      status: status,
      client: { id: clientId },
      branch: { id: branchId },
      city: { id: In(cityIds) },
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            phoneNumber: ILike(`%${search}%`),
          },
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
        ]
      : baseConditions;

    if (where?.length) {
      where.forEach(function (v: any) {
        if (!status) delete v.status;
        if (!cityIds?.length) delete v.city;
        if (!clientId) delete v?.client.id;
        if (!branchId) delete v.branch;
      });
    } else {
      if (!status) delete where.status;
      if (!cityIds?.length) delete where.city;
      if (!clientId) delete where?.client;
      if (!branchId) delete where.branch;
    }
    const [list, count] = await this.awarenessCampRepository.findAndCount({
      select: {
        id: true,
        client: { id: true, name: true },
        branch: { id: true, name: true },
        city: { id: true, name: true },
        phoneNumber: true,
        noOfEmployee: true,
        type: true,
        eventDate: true,
        status: true,
        clientStatus: true,
        isActive: true,
        createdAt: true,
      },
      relations: {
        client: true,
        branch: true,
        city: true,
      },
      where: where,
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  private checkAwarenessCampEmpType(type: string) {
    const result: any = checkValueExists(AwarenessCampEmployeeType, type);
    if (!result) throw AwarenessCampResponseCodes.EMPLOYEE_TYPE_NOT_EXISTS;
    return true;
  }

  sendNotification(user: User, payload: ICampNotificationPayload) {
    const { status } = payload;
    const notificationType =
      status == AwarenessCampStatus.COMPLETED
        ? NOTIFICATION_TYPES.AWARENESSCAMP_COMPLETED
        : status == AwarenessCampStatus.REJECT
          ? NOTIFICATION_TYPES.AWARENESSCAMP_REJECT
          : NOTIFICATION_TYPES.AWARENESSCAMP_PLANNED;
    payload.type = notificationType;
    this.eventEmitter.emit(Events.NOTIFICATION_CREATED, {
      data: {
        from: user,
        notification: null,
        title: null,
        extraParams: null,
        data: {
          awarenessCamp: payload,
        },
        source: Source.AWARENESS_CAMP,
      },
    });
  }

  async getAwarenessCampDetails(id: number) {
    const data = await this.awarenessCampRepository.findOne({
      where: { id },
      relations: {
        client: true,
        branch: true,
        city: {
          users: true,
        },
        createdBy: true,
      },
      select: {
        client: { name: true, id: true },
        branch: { name: true, id: true },
        city: { name: true, id: true },
        createdBy: { id: true, name: true, userType: true },
      },
    });
    return data;
  }
}
