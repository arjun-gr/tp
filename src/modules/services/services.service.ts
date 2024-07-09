import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  ILike,
  In,
  MoreThan,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PAD_ORDER_TYPE, VM_SERVICE_TYPE } from '../../common/enums/client';
import { NOTIFICATION_TYPES, Source } from '../../common/enums/notifications';
import { ServiceStatus, ServiceType } from '../../common/enums/services';
import { Agents } from '../../entities/agents.entity';
import { Branch } from '../../entities/branch.entity';
import { City } from '../../entities/city.entity';
import { Clients } from '../../entities/clients.entity';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { Purchase } from '../../entities/purchase.entity';
import { ServiceProduct } from '../../entities/service-product.entity';
import { Services } from '../../entities/services.entity';
import { User } from '../../entities/user.entity';
import { IPadcareFiles } from '../../interfaces/client';
import { IServiceNotificationPayload } from '../../interfaces/notifications';
import {
  ICreateService,
  IServiceAnalyticEvent,
  IServiceEntity,
  IServiceProductCondition,
  IServiceProductEntity,
} from '../../interfaces/service';
import {
  datesInPeriod,
  getFirstAndLastDayOfMonth,
} from '../../utils/date.utils';
import { CityService } from '../city/city.service';
import { ClientService } from '../client/client.service';
import { BranchContractRequestDto } from '../client/dto/branch-new-request.dto';
import { PurchaseService } from '../client/purchase.service';
import {
  BRANCH_REPOSITORY,
  PADCARE_FILES_REPOSITORY,
  SERVICE_PRODUCT_REPOSITORY,
  SERVICE_REPOSITORY,
} from '../database/database.providers';
import { CreateAgentsDto } from './dto/create-agent.dto';
import { CreatePartialServiceDto } from './dto/create-partial-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceProductService } from './service-product.service';
import { ServiceResponseCodes } from './service.response.codes';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateFemaleHygieneUnitDto } from '../client/dto/female-hygiene-unit.dto';
import { FemaleHygieneUnitInstallDto } from './dto/fhu-installation.dto';
import { CreateMaintenanceServiceDto } from './dto/create-maintaince-services.dto';
import { Products } from 'src/entities/product.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServicesService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    @Inject(PADCARE_FILES_REPOSITORY)
    private padcareFileRepository: Repository<PadcareFiles>,
    private clientService: ClientService,
    private cityService: CityService,
    private eventEmitter: EventEmitter2,
    @Inject(SERVICE_PRODUCT_REPOSITORY)
    private serviceProductRepository: Repository<ServiceProduct>,
    @Inject(forwardRef(() => PurchaseService))
    private purchaseService: PurchaseService,
    @Inject(forwardRef(() => ServiceProductService))
    private serviceProductService: ServiceProductService,
  ) {}

  async create(createService: ICreateService) {
    const createServiceDto =
      createService.createClientDto ||
      createService.addBranch ||
      createService.newContract;



    const queryRunner = createService.queryRunner;
    
    if(createService.addBranch) createService.date = createService.createClientDto.completedAt;
    if(createService.newContract) createService.date = createService.createClientDto.completedAt; 
    const serviceCreated = await this.saveServiceDetail(
      createService.user,
      createService.client,
      createService.city,
      createService.branch,
      createService.purchase,
      createService.type,
      createService.date,
      new Date(createService.completedAt),
      // createService.completedAt,
      queryRunner,
    );

    await Promise.all([
      await this.serviceProductService.saveFemaleHygieneUnitProduct(
        createServiceDto?.femaleHygieneUnit,
        serviceCreated,
        queryRunner,
      ),
      await this.serviceProductService.saveVendingMachine(
        createServiceDto?.vendingMachine,
        serviceCreated,
        queryRunner,
      ),
      await this.serviceProductService.saveSanitaryBuyoutPad(
        createServiceDto?.sanitaryPads,
        serviceCreated,
        queryRunner,
      ),
      await this.serviceProductService.saveVendingMachinePads(
        createServiceDto?.vmPads,
        serviceCreated,
        queryRunner,
      ),
      await this.serviceProductService.saveSimDetails(
        { createService: createServiceDto?.simRecharge },
        serviceCreated,
        queryRunner,
      ),
    ]);
    await this.updateServiceDetails(
      serviceCreated?.id,
      null,
      createService.serviceDto,
      queryRunner,
    );
    await this.markServiceAsCompleted(
      { status: ServiceStatus.COMPLETED },
      serviceCreated,
      createService.user,
      serviceCreated.purchase,
      queryRunner,
      createService.installationDate,
    );

    // this.sendServiceNotification(createService.user, {
    //   serviceId: serviceCreated.id,
    //   status: ServiceStatus.PLANNED,
    //   type: NOTIFICATION_TYPES.SERVICE_PLANNED,
    //   serviceType: createService.type as ServiceType,
    // });
    return { message: 'Service created successfully', service: serviceCreated };
  }

  async findAll(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    status: ServiceStatus,
    date: Date,
    month: Date,
    type?: ServiceType,
    dashboardOrder: boolean = false,
    upcomingServices: boolean = false,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    let dateFilter = null;
    if (month) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);
      dateFilter = Between(firstDay, lastDay);
    }
    if (date) dateFilter = date;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let defaultOrder: any = { createdAt: order };
    let defaultDateFilter: any = { serviceAt: dateFilter };
    // Map status to corresponding order and date filter
    if (dashboardOrder) {
      switch (status) {
        case ServiceStatus.PLANNED:
          defaultOrder = { serviceAt: order };
          // defaultDateFilter = { serviceAt: dateFilter };
          break;
        case ServiceStatus.COMPLETED:
          defaultOrder = { completedAt: order };
          // defaultDateFilter = { completedAt: dateFilter };
          break;
        case ServiceStatus.CANCELLED:
          defaultOrder = { cancelledAt: order };
          // defaultDateFilter = { cancelledAt: dateFilter };
          break;
      }
    }
    if (upcomingServices) {
      defaultDateFilter = { serviceAt: MoreThan(new Date()) };
      defaultOrder = { serviceAt: order };
    }
    // Assign custom order and date filter
    const customOrder = defaultOrder;
    const customDateFilter = defaultDateFilter;
    const baseConditions = {
      isActive: true,
      status,
      city: { id: In(cityIds) },
      client: { id: clientId },
      branch: { id: branchId },
      type,
      ...customDateFilter,
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            id: ILike(`${search}`),
          },
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
          {
            ...baseConditions,
            branch: { ...baseConditions.branch, name: ILike(`%${search}%`) },
          },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v) {
        if (!cityIds?.length) delete v?.city;
        if (status == undefined) delete v.status;
        if (!dateFilter) delete v?.serviceAt;
        if (!clientId) delete v.client.id;
        if (!branchId) delete v.branch.id;
        if (!type) delete v.type;
      });
    } else {
      if (!cityIds?.length) delete where.city;
      if (status == undefined) delete where.status;
      if (!dateFilter) delete where?.serviceAt;
      if (!clientId) delete where.client;
      if (!branchId) delete where.branch;
      if (!type) delete where.type;
    }

    const [list, count] = await this.serviceRepository.findAndCount({
      relations: {
        user: true,
        client: true,
        city: true,
        branch: true,
        agents: true,
        purchase: {
          branchProduct: {
            product: true,
          },
        },
      },
      select: {
        user: { id: true, name: true },
        client: { id: true, name: true },
        city: { id: true, name: true },
        branch: { id: true, name: true },
        agents: { name: true },
      },
      where: where,
      order: customOrder,
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const serviceList = [];
    for (const service of list) {
      // let serviceFiles = [];
      // if (service.status === ServiceStatus.COMPLETED) {
      //   const files = await this.getServiceFilesByServiceId(service.id, false);
      //   const formatResp = serviceFilesResponseFormat(files);
      //   serviceFiles.push(...formatResp);
      // }
      if (service.type === ServiceType.SERVICE) {
        service['serviceProduct'] = await this.getServiceProductsByServiceId(
          service.id,
          true,
        );
      }
      serviceList.push({ ...service });
    }
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(serviceList, pageMetaDto);
  }

  async getAllServicesForChart(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    status: ServiceStatus,
    date: Date,
    month: Date,
    type?: ServiceType,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    let dateFilter = null;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    if (month) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);
      dateFilter = Between(firstDay, lastDay);
    }
    if (date) dateFilter = date;
    const baseConditions = {
      isActive: true,
      status: status,
      serviceAt: dateFilter,
      type: type,
      city: { id: In(cityIds) },
      client: { id: clientId },
      branch: { id: branchId },
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
          {
            ...baseConditions,
            branch: { ...baseConditions.branch, name: ILike(`%${search}%`) },
          },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v) {
        if (!cityIds?.length) delete v?.city;
        if (status == undefined) delete v.status;
        if (!dateFilter) delete v?.serviceAt;
        if (!clientId) delete v.client.id;
        if (!branchId) delete v.branch.id;
        if (!type) delete v.type;
      });
    } else {
      if (!cityIds?.length) delete where.city;
      if (status == undefined) delete where.status;
      if (!dateFilter) delete where?.serviceAt;
      if (!clientId) delete where.client;
      if (!branchId) delete where.branch;
      if (!type) delete where.type;
    }

    const services: any = await this.serviceRepository.find({
      relations: {
        user: true,
        client: true,
        city: true,
        branch: true,
        agents: true,
        purchase: {
          branchProduct: {
            product: true,
          },
        },
      },
      select: {
        user: { id: true, name: true },
        client: { id: true, name: true },
        city: { id: true, name: true },
        branch: { id: true, name: true },
        agents: { name: true },
      },
      where: where,
      order: { createdAt: order },
    });
    for (const service of services) {
      if (service.type === ServiceType.SERVICE) {
        service['serviceProduct'] = await this.getServiceProductsByServiceId(
          service.id,
          true,
        );
      }
    }
    return services;
  }

  async findOne(id: number) {
    const service: any = await this.serviceRepository.findOne({
      where: { id, isActive: true },
      relations: {
        client: {
          ifmClient: true,
          logo: true,
        },
        branch: true,
        city: true,
        purchase: true,
        agents: true,
      },
      select: {
        id: true,
        isActive: true,
        type: true,
        date: true,
        status: true,
        rating: true,
        serviceDate: true,
        clientOnboardingProduct: true,
        stickers: true,
        isInvoiceSubmitted: true,
        invoiceOther: true,
        totalServiceCost: true,
        vehicleUsed: true,
        otherVehicleDetail: true,
        binMaintenanceParts: true,
        binMaintenancePartQty: true,
        binMaintenanceOtherPart: true,
        wastePadCollection: true,
        invoiceAmount: true,
        client: {
          id: true,
          name: true,
          type: true,
          industryType: true,
          ifmClient: {
            id: true,
            name: true,
          },
          logo: {
            url: true,
          },
        },
        branch: {
          id: true,
          name: true,
          pincode: true,
          billingAddress: true,
          siteAddress: true,
        },
        city: {
          id: true,
          name: true,
        },
        purchase: {
          soNumber: true,
          soReceivedDate: true,
          contractStartDate: true,
          contractEndDate: true,
        },
        agents: {
          name: true,
          quantity: true,
        },
      },
    });
    if (!service) throw new Error('Service not found');
    const agents = await this.getAllServiceAgentsById(service.id);
    if (agents?.length) delete service.agents;
    service.agents = agents;
    const serviceProduct: any = await this.getServiceProductsByServiceId(id);
    return { service, products: serviceProduct };
  }

  async rescheduleService(
    id: number,
    updateServiceDto: UpdateServiceDto,
    user: User,
    queryRunnerParam?: QueryRunner,
  ) {
    const service = await this.throwIfServiceNotExists(id);
    if (!updateServiceDto?.rescheduleDate && !updateServiceDto?.reason) return;
    let queryRunner: QueryRunner;
    if (!queryRunnerParam) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } else {
      queryRunner = queryRunnerParam;
    }
    try {
      await queryRunner.manager.update(
        Services,
        { id: service.id },
        {
          rescheduleReason: updateServiceDto.reason,
          rescheduleDate: updateServiceDto.rescheduleDate,
          rescheduleAt: new Date(),
          serviceAt: updateServiceDto.rescheduleDate,
          rescheduleBy: user,
        },
      );
      if (!queryRunnerParam) await queryRunner.commitTransaction();
      this.sendServiceNotification(user, {
        serviceId: service.id,
        status: ServiceStatus.RESCHEDULED,
        type: NOTIFICATION_TYPES.SERVICE_RESCHEDULED,
        serviceType: service.type as ServiceType,
      });
      return {
        message: 'Service re-scheduled successfully',
      };
    } catch (error: any) {
      if (!queryRunnerParam) await queryRunner.rollbackTransaction();
      console.log('Services :: rescheduleService =>', error);
      throw new BadRequestException(error?.message);
    } finally {
      if (!queryRunnerParam) await queryRunner.release();
    }
  }

  async updateStatus(
    id: number,
    updateServiceDto: UpdateServiceDto,
    user: User,
    queryRunnerParam?: QueryRunner,
  ) {
    if (!updateServiceDto.status) return;
    let queryRunner: QueryRunner;
    if (!queryRunnerParam) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } else {
      queryRunner = queryRunnerParam;
    }

    try {
      const service = await this.getServicePartialDetail(id);
      // if (
      //   service.status === ServiceStatus.COMPLETED ||
      //   service.status === ServiceStatus.CANCELLED
      // ) {
      //   throw ServiceResponseCodes.SERVICE_UPDATE_ACTION_DENIED;
      // }

      if (
        updateServiceDto.status == ServiceStatus.COMPLETED &&
        service.type == ServiceType.INSTALLATION
      ) {
        const purchaseId = service.purchase.id;
        await this.markServiceAsCompleted(
          updateServiceDto,
          service,
          user,
          service.purchase,
          queryRunner,
        );
      } else if (updateServiceDto.status == ServiceStatus.CANCELLED) {
        await this.markServiceAsCancelled(
          updateServiceDto,
          service,
          user,
          queryRunner,
        );
      } else {
        await queryRunner.manager.update(
          Services,
          { id: service.id },
          {
            status: updateServiceDto.status,
          },
        );
        this.sendServiceNotification(user, {
          serviceId: service.id,
          status: updateServiceDto.status as ServiceStatus,
          type: NOTIFICATION_TYPES.SERVICE_STATUS_UPDATED,
          serviceType: service.type as ServiceType,
        });
        if (
          updateServiceDto.status == ServiceStatus.COMPLETED &&
          service.type == ServiceType.SERVICE
        ) {
          this.analyticEvent({
            client: service.client,
            branch: service.branch,
            city: service.city,
            serviceId: service.id,
            date: service.date,
          });
        }
      }

      if (!queryRunnerParam) await queryRunner.commitTransaction();
      return {
        message: 'Service status updated successfully',
      };
    } catch (error: any) {
      if (!queryRunnerParam) await queryRunner.rollbackTransaction();
      console.log('Services :: updateStatus =>', error);
      throw new BadRequestException(error?.message);
    } finally {
      if (!queryRunnerParam) await queryRunner.release();
    }
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    await this.serviceRepository.softDelete(id);
    this.sendServiceNotification(service.user, {
      serviceId: service.id,
      status: ServiceStatus.CANCELLED,
      type: NOTIFICATION_TYPES.SERVICE_DELETED,
      serviceType: service.type as ServiceType,
    });
    return {
      message: 'Service delete successfully',
    };
  }

  private async throwIfServiceNotExists(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id, isActive: true },
    });
    if (!service) {
      throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    }
    return service;
  }

  private async throwIfBranchNotExists(id: number) {
    const branch = await this.branchRepository.findOne({
      where: { id, isActive: true },
    });
    if (!branch) {
      throw ServiceResponseCodes.BRANCH_NOT_EXISTS;
    }
    return branch;
  }

  private async getServicePartialDetail(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id, isActive: true },
      select: {
        purchase: { id: true },
        city: { id: true },
        branch: { id: true },
        client: { id: true },
        user: { id: true },
      },
      relations: {
        purchase: true,
        city: true,
        branch: true,
        client: true,
        user: true,
      },
    });
    if (!service) {
      throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    }
    return service;
  }

  async createServicesOfProducts(
    dto: CreatePartialServiceDto,
    queryRunner: QueryRunner,
  ) {
    if (!dto?.date?.length) return;
    for (let date of dto.date) {
      const serviceCreated = await this.saveServiceDetail(
        dto.user,
        dto.client,
        dto.city,
        dto.branch,
        dto.purchase,
        ServiceType.SERVICE,
        new Date(date),
        null,
        queryRunner,
      );
      await Promise.all([
        await this.serviceProductService.saveFemaleHygieneUnitProduct(
          dto?.femaleHygieneUnit,
          serviceCreated,
          queryRunner,
        ),
        await this.serviceProductService.saveVendingMachine(
          dto?.vendingMachine,
          serviceCreated,
          queryRunner,
        ),
        await this.serviceProductService.saveSanitaryBuyoutPad(
          dto?.sanitaryPads,
          serviceCreated,
          queryRunner,
        ),
        await this.serviceProductService.saveVendingMachinePads(
          dto?.vmPads,
          serviceCreated,
          queryRunner,
        ),
        await this.serviceProductService.saveSimDetails(
          { createService: dto?.simRecharge },
          serviceCreated,
          queryRunner,
        ),
      ]);
    }
  }

  async uploadServiceFiles(
    padcareFile: IPadcareFiles,
    queryRunner: QueryRunner,
  ) {
    let where: any = {};
    if (padcareFile.client) {
      where['client'] = { id: padcareFile.client.id };
    }
    if (padcareFile.branch) {
      where['branch'] = { id: padcareFile.branch.id };
    }
    if (padcareFile.city) {
      where['city'] = { id: padcareFile.city.id };
    }
    if (padcareFile.purchase) {
      where['purchase'] = { id: padcareFile.purchase.id };
    }
    if (padcareFile.service) {
      where['service'] = { id: padcareFile.service.id };
    }
    if (padcareFile.branchProduct) {
      where['branchProduct'] = { id: padcareFile.branchProduct };
    }
    if (padcareFile.serviceProduct) {
      where['serviceProduct'] = { id: padcareFile.serviceProduct };
    }
    if (padcareFile.fileType) {
      where['fileType'] = padcareFile.fileType;
    }

    await queryRunner.manager.delete(PadcareFiles, { ...where });
    // await this.padcareFileRepository.delete({ ...where });
    if (padcareFile.fileIds?.length) {
      for (const file of padcareFile?.fileIds) {
        const padcareFiles = new PadcareFiles();
        padcareFiles.fileId = file;
        padcareFiles.fileType = padcareFile.fileType;
        padcareFiles.user = padcareFile?.user;
        padcareFiles.client = padcareFile?.client;
        padcareFiles.branch = padcareFile?.branch;
        padcareFiles.city = padcareFile?.city;
        padcareFiles.purchase = padcareFile?.purchase;
        padcareFiles.service = padcareFile?.service;
        padcareFiles.branchProduct = padcareFile?.branchProduct;
        padcareFiles.serviceProduct = padcareFile?.serviceProduct;
        await queryRunner.manager.save(PadcareFiles, padcareFiles);
        // await this.padcareFileRepository.save(padcareFiles);
      }
    }
  }

  async groupServiceFilesByType(padcarefiles: IPadcareFiles) {
    try {
      const files = await this.padcareFileRepository.find({
        // where: {
        //   entityId: serviceId,
        //   entityType: SERVICE,
        // },
        relations: {
          fileId: true,
        },
        select: {
          fileId: {
            id: true,
            originalName: true,
            size: true,
            url: true,
            mimetype: true,
          },
        },
      });
      const grouped = {};
      if (files && files?.length) {
        files.forEach((obj: any) => {
          const { fileType, fileId } = obj;
          if (!grouped[fileType]) {
            grouped[fileType] = [];
          }
          grouped[fileType].push(fileId);
        });
      }
      return grouped;
    } catch (error) {
      console.log('Services :: groupServiceFilesByType ::', error?.message);
    }
  }

  private throwErrorIfServiceTypeNotExists(type: any) {
    let res = Object.values(ServiceType).includes(type);
    if (!res) throw new Error('Service type not Exists');
    return type;
  }

  async deleteAgentByServiceId(id: number, queryRunner: QueryRunner) {
    return queryRunner.manager.delete(Agents, { service: { id: id } });
    // return this.agentRepository.delete({ service: { id: id } });
  }

  async updateServiceForm(
    id: number,
    updateServiceDto: UpdateServiceDto,
    user: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const serviceExists = await this.findServiceById(id);
      const serviceProduct: any = await this.getServiceProductsByServiceId(
        id,
        false,
        false,
      );
      await Promise.all([
        await this.updateServiceDetails(
          id,
          user,
          updateServiceDto,
          queryRunner,
        ),
        await this.saveOrUpdateAgentDetails(
          updateServiceDto?.agents,
          serviceExists,
          queryRunner,
        ),
        await this.serviceProductService.updateFemaleHygieneUnitProduct(
          updateServiceDto?.femaleHygieneUnit,
          serviceExists,
          queryRunner,
        ),
        await this.serviceProductService.updateVendingMachine(
          updateServiceDto?.vendingMachine,
          serviceExists,
          queryRunner,
        ),
        await this.serviceProductService.updateSimDetails(
          updateServiceDto?.simCard,
          serviceExists,
          queryRunner,
          serviceProduct?.sim,
        ),
        await this.serviceProductService.updateVendingMachinePads(
          updateServiceDto?.vmPads,
          serviceExists,
          queryRunner,
        ),
        await this.serviceProductService.updateSanitaryBuyoutPad(
          updateServiceDto?.sanitaryPads,
          serviceExists,
          queryRunner,
        ),
        await this.updateStatus(id, updateServiceDto, user, queryRunner),
        await this.rescheduleService(id, updateServiceDto, user, queryRunner),
      ]);
      await queryRunner.commitTransaction();
      return {
        id: id,
        message: 'Service update successfully',
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('Services :: updateServiceForm ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getServiceFilesByServiceId(id: number, groupedBy: boolean = true) {
    try {
      const files = await this.padcareFileRepository.find({
        where: {
          service: { id: id },
        },
        relations: {
          service: true,
          serviceProduct: true,
          fileId: true,
        },
        select: {
          service: { id: true },
          serviceProduct: { id: true },
          fileId: {
            id: true,
            originalName: true,
            size: true,
            url: true,
            mimetype: true,
          },
        },
      });
      if (!groupedBy) return files;
      const serviceFiles = {};
      if (files && files?.length) {
        files.forEach((obj: any) => {
          const {
            fileType,
            fileId,
            service: { id: serviceId },
            serviceProduct: { id: serviceProductId },
          } = obj;
          // const serviceProductId = obj.serviceProduct.id;
          if (!serviceFiles[serviceProductId]) {
            serviceFiles[serviceProductId] = [];
          }
          serviceFiles[serviceProductId].push({
            ...fileId,
            fileType,
            serviceProductId,
            serviceId,
          });
        });
      }
      return serviceFiles;
    } catch (error) {
      console.log(
        'Services :: groupServiceFilesByServiceId ::',
        error?.message,
      );
    }
  }

  async createPartialServices(
    service: Services,
    purchase: any,
    queryRunner: QueryRunner,
  ) {
    if (!purchase && !purchase?.branchProduct) return;
    // const currentDate = new Date();
    const serviceDate = service.serviceAt;
    const branchProduct = purchase?.branchProduct;

    for (const femaleHygieneUnit of branchProduct?.femaleHygieneUnit) {
      if (!femaleHygieneUnit?.serviceFrequency) break;
      const serviceDates = datesInPeriod(
        serviceDate,
        purchase.contractEndDate,
        femaleHygieneUnit.serviceFrequency,
      );
      if (serviceDates && serviceDates?.length == 0) return;
      let partialService = new CreatePartialServiceDto();
      partialService.branch = service.branch;
      partialService.city = service.city;
      partialService.client = service.client;
      partialService.user = service.user;
      partialService.purchase = service.purchase;
      partialService.date = serviceDates;
      let femaleHygieneUnits: any = [];
      let fhu: any = {};
      fhu.productId = femaleHygieneUnit?.productId;
      fhu.quantity = femaleHygieneUnit?.quantity;
      fhu.serviceType = femaleHygieneUnit?.serviceFrequency;
      femaleHygieneUnits.push(fhu);
      partialService.femaleHygieneUnit = femaleHygieneUnits;
      await this.createServicesOfProducts(partialService, queryRunner);
    }

    for (const vendingMachine of branchProduct.vendingMachine) {
      if (
        vendingMachine?.serviceFrequency &&
        vendingMachine.serviceType != VM_SERVICE_TYPE.BUYOUT
      ) {
        const serviceDates = datesInPeriod(
          serviceDate,
          purchase.contractEndDate,
          vendingMachine.serviceFrequency,
        );
        if (!serviceDates?.length) return;
        let partialService = new CreatePartialServiceDto();
        partialService.branch = service.branch;
        partialService.city = service.city;
        partialService.client = service.client;
        partialService.user = service.user;
        partialService.purchase = service.purchase;
        partialService.date = serviceDates;
        let vendingMachines: any = [];
        let vm: any = {};
        vm.productId = vendingMachine?.productId;
        vm.serviceType = vendingMachine?.serviceType;
        vm.serviceFrequency = vendingMachine?.serviceFrequency;
        vm.quantity = vendingMachine?.quantity;
        vendingMachines.push(vm);
        partialService.vendingMachine = vendingMachines;
        await this.createServicesOfProducts(partialService, queryRunner);
      }
    }
  }

  async saveServiceDetail(
    user: User,
    client: Clients,
    city: City,
    branch: Branch,
    purchase: Purchase,
    serviceType: string,
    serviceDate: Date,
    completedAt:Date,
    queryRunner: QueryRunner,
    
  ) {
    const service = new Services();
    service.user = user;
    service.client = client;
    service.city = city;
    service.branch = branch;
    service.purchase = purchase;
    service.type = this.throwErrorIfServiceTypeNotExists(serviceType);
    service.date = serviceDate;
    service.serviceAt = serviceDate;
    service.status = ServiceStatus.COMPLETED;
    service.completedAt = completedAt;
    // const serviceCreated = await this.serviceRepository.save(service);
    return await queryRunner.manager.save(Services, service);
  }

  async updateServiceDetails(
    serviceId: number,
    user: User,
    dto: UpdateServiceDto,
    queryRunner: QueryRunner,
  ) {
    const service = new Services();
    service.user = user;
    if (dto?.clientId) {
      const client = await this.clientService.throwIfClientNotExists(
        dto.clientId,
      );
      service.client = client;
    }
    if (dto?.branchId) {
      const branch = await this.throwIfBranchNotExists(dto.branchId);
      service.branch = branch;
    }
    if (dto?.cityId) {
      const city = await this.cityService.throwIfCityIdNotExists(dto.cityId);
      service.city = city;
    }

    if (dto?.type)
      service.type = this.throwErrorIfServiceTypeNotExists(dto.type);
    service.date = dto?.date;
    service.status = dto?.status;
    if (dto?.actualServiceDate) service.serviceDate = dto?.actualServiceDate;
    if (dto?.rating) service.rating = dto.rating;
    if (dto?.totalServiceCost) service.totalServiceCost = dto?.totalServiceCost;
    if (dto?.wastePadCollection) {
      service.wastePadCollection = dto?.wastePadCollection;
    }
    if (dto?.stickers) service.stickers = dto?.stickers;
    if (dto?.clientOnboardingProduct) {
      service.clientOnboardingProduct = dto?.clientOnboardingProduct;
    }
    if (dto?.isInvoiceSubmitted) {
      service.isInvoiceSubmitted = dto?.isInvoiceSubmitted;
    }
    if (dto?.invoiceOther) {
      service.invoiceOther = dto?.invoiceOther;
    }
    if (dto?.vehicleUsed) {
      service.vehicleUsed = dto?.vehicleUsed;
    }
    if (dto?.otherVehicleDetails) {
      service.otherVehicleDetail = dto?.otherVehicleDetails;
    }
    if (dto?.binMaintenancePart) {
      service.binMaintenanceParts = dto?.binMaintenancePart;
    }
    if (dto?.otherBinMaintenancePart) {
      service.binMaintenanceOtherPart = dto?.otherBinMaintenancePart;
    }
    if (dto?.binMaintenancePartQty) {
      service.binMaintenancePartQty = dto?.binMaintenancePartQty;
    }
    if (dto?.serviceInvoiceAmount) {
      service.invoiceAmount = dto?.serviceInvoiceAmount;
    }
    service.invoiceAmount = dto?.serviceInvoiceAmount|| null;
    // service.rescheduleDate = dto.rescheduleDate;
    // await this.serviceRepository.update(serviceId, service);

    // await queryRunner.manager.getRepository(Services).update(serviceId, service)
    await queryRunner.manager.update(Services, { id: serviceId }, service);
  }

  async saveOrUpdateAgentDetails(
    agents: CreateAgentsDto[],
    service: Services,
    queryRunner: QueryRunner,
  ) {
    if (!agents?.length) return;
    await this.deleteAgentByServiceId(service.id, queryRunner);
    for (const key of agents) {
      const agent = new Agents();
      agent.service = service;
      agent.name = key?.name ? key.name : '';
      agent.quantity = key?.quantity ? key.quantity : null;
      // await this.agentRepository.save(agent);
      await queryRunner.manager.save(Agents, agent);
    }
  }

  async deactivateServicesByPurchaseId(
    purchaseId: number,
    status: boolean,
    queryRunner: QueryRunner,
  ) {
    if (status) {
      await queryRunner.manager.update(
        Services,
        {
          purchase: { id: purchaseId },
          date: MoreThan(new Date()),
        },
        {
          isActive: status,
        },
      );
    } else {
      await queryRunner.manager.update(
        Services,
        {
          purchase: { id: purchaseId },
          status: ServiceStatus.PLANNED,
        },
        {
          isActive: status,
        },
      );
    }
  }

  async findServiceById(serviceId: number) {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, isActive: true },
      relations: {
        user: true,
        client: true,
        branch: true,
        city: true,
        purchase: true,
      },
    });
    if (!service) {
      throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    }
    return service;
  }

  async findServiceByPurchaseId(purchaseId: number) {
    const service = await this.serviceRepository.findOne({
      where: { purchase: { id: purchaseId }, isActive: true },
      relations: {
        user: true,
        client: true,
        branch: true,
        city: true,
        purchase: true,
      },
    });
    if (!service) {
      throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    }
    return service;
  }

  async getServiceProductsByServiceId(
    serviceId: number,
    onlyProducts: boolean = false,
    requiredFiles: boolean = true,
  ) {
    const serviceProduct: any = await this.serviceProductRepository.find({
      where: { service: { id: serviceId }, isActive: true },
      relations: {
        product: true,
        service: {
          user: true,
          client: true,
          branch: true,
          city: true,
          purchase: true,
        },
      },
      select: {
        service: {
          id: true,
          user: { id: true },
          client: { id: true },
          branch: { id: true },
          city: { id: true },
          purchase: { id: true },
        },
        product: { id: true, name: true },
      },
    });
    if (onlyProducts) return serviceProduct;
    let serviceFiles: any = null;
    if (requiredFiles) {
      serviceFiles = await this.getServiceFilesByServiceId(serviceId);
    }
    let data = await this.serviceProductService.getServiceProduct(
      serviceProduct,
      serviceFiles,
    );
    return data;
  }

  async markServiceAsCompleted(
    updateServiceDto: UpdateServiceDto,
    service: Services,
    user: User,
    purchase: Purchase,
    queryRunner: QueryRunner,
    // currentDate: Date = new Date(),
    currentDate: Date = new Date(service.serviceAt)
  ) {
    // console.log('markServiceAsCompleted :',purchase);

    const serviceId = service.id;
    // const purchase =
    //   await this.purchaseService.getPurchaseDetailsById(purchaseId);
    // if (purchase?.branchProduct) {
    //   await this.createPartialServices(service, purchase, queryRunner);
    // }
    if (!purchase?.installationDate) {
      await queryRunner.manager.update(
        Purchase,
        { id: purchase?.id },
        {
          installationDate: currentDate,
        },
      );
    }
    await queryRunner.manager.update(
      Services,
      { id: serviceId },
      {
        status: updateServiceDto.status,
        serviceDate: updateServiceDto?.actualServiceDate,
        // completedAt: service.completedAt,
        completedAt: new Date(currentDate),
        completedBy: user,
        serviceAt: currentDate,
      },
    );
    // this.sendServiceNotification(user, {
    //   serviceId: service.id,
    //   status: ServiceStatus.COMPLETED,
    //   type: NOTIFICATION_TYPES.SERVICE_COMPLETED,
    //   serviceType: service.type as ServiceType,
    // });
  }

  async markServiceAsCancelled(
    updateServiceDto: UpdateServiceDto,
    service: Services,
    user: User,
    queryRunner: QueryRunner,
    currentDate: Date = new Date(),
  ) {
    const serviceId = service.id;
    await queryRunner.manager.update(
      Services,
      { id: serviceId },
      {
        status: updateServiceDto.status,
        cancelledReason: updateServiceDto?.cancelledReason,
        cancelledAt: currentDate,
        cancelledBy: user,
        serviceAt: currentDate,
      },
    );
    this.sendServiceNotification(user, {
      serviceId: service.id,
      status: ServiceStatus.CANCELLED,
      type: NOTIFICATION_TYPES.SERVICE_CANCELLED,
      serviceType: service.type as ServiceType,
    });
  }

  async createMaintenanceServicesOfProduct(
    queryRunner: QueryRunner,
    user: User,
    purchase: Purchase,
  ) {
    const serviceCreated = await this.saveServiceDetail(
      user,
      purchase.branch.client,
      purchase.branch.city,
      purchase.branch,
      purchase,
      ServiceType.SERVICE,
      new Date(),
      null,
      queryRunner,
    );
    if (purchase?.branchProduct) {
      await this.createPartialServices(serviceCreated, purchase, queryRunner);
    }
  }

  async updateServiceProductsByPurchaseId(
    queryRunner: QueryRunner,
    user: User,
    purchase: Purchase,
    dto: BranchContractRequestDto,
  ) {
    const service = await this.findServiceByPurchaseId(purchase.id);
    const serviceProducts = await this.getServiceProductsByServiceId(
      service.id,
    );
    await Promise.all([
      await this.serviceProductService.updateFemaleHygieneUnitProduct(
        serviceProducts?.femaleHygieneUnit,
        service,
        queryRunner,
      ),
      await this.serviceProductService.updateVendingMachine(
        serviceProducts?.vendingMachine,
        service,
        queryRunner,
      ),
      await this.serviceProductService.updateSimDetails(
        serviceProducts?.sim,
        service,
        queryRunner,
      ),
      await this.serviceProductService.updateVendingMachinePads(
        serviceProducts?.vendingMachinePads,
        service,
        queryRunner,
      ),
      await this.serviceProductService.updateSanitaryBuyoutPad(
        serviceProducts?.sanitaryPads,
        service,
        queryRunner,
      ),
    ]);
  }

  async deleteInstallationServiceIfPresent(
    queryRunner: QueryRunner,
    purchaseId: number,
  ) {
    const service = await this.serviceRepository.findOne({
      where: {
        type: In([ServiceType.INSTALLATION, ServiceType.DEMO]),
        status: Not(ServiceStatus.COMPLETED),
        purchase: { id: purchaseId },
      },
    });
    if (service) {
      await this.deleteAgentByServiceId(service.id, queryRunner);
      await queryRunner.manager.delete(Services, {
        type: In([ServiceType.INSTALLATION, ServiceType.DEMO]),
        status: Not(ServiceStatus.COMPLETED),
        purchase: { id: purchaseId },
      });
      await queryRunner.manager.delete(ServiceProduct, { id: purchaseId });
    }
  }

  async getAllServiceAgentsById(serviceId: number) {
    const agents = await this.serviceRepository.find({
      where: {
        id: serviceId,
      },
      relations: {
        agents: true,
      },
    });
    const data = agents.map((a) => a.agents);
    return (
      data?.length &&
      data[0]?.length &&
      data[0].map((val) => ({ name: val.name, quantity: val.quantity }))
    );
  }

  async deactivateContractServicesByPurchaseId(
    purchaseId: number | number[],
    status: boolean = false,
  ) {
    let where: any = {};
    const updateValue = { isActive: status };
    if (typeof purchaseId == 'number') {
      where['purchase'] = { id: purchaseId };
    }
    if (purchaseId instanceof Array || Array.isArray(purchaseId)) {
      where['purchase'] = { id: In(purchaseId) };
    }
    if (status) {
      where['date'] = MoreThan(new Date());
    } else {
      where['status'] = ServiceStatus.PLANNED;
    }
    await this.serviceRepository.update(where, updateValue);
  }

  sendServiceNotification(user: User, payload: IServiceNotificationPayload) {
    this.eventEmitter.emit(Events.NOTIFICATION_CREATED, {
      data: {
        from: user,
        notification: null,
        title: null,
        extraParams: null,
        data: {
          service: payload,
        },
        source: Source.SERVICE,
      },
    });
  }

  async getServiceDetailForNotification(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id, isActive: true },
      select: {
        city: {
          id: true,
          name: true,
          users: {
            id: true,
            userType: true,
            name: true,
          },
        },
        branch: { id: true, name: true },
        client: { id: true, name: true },
      },
      relations: {
        city: { users: true },
        branch: true,
        client: true,
      },
    });
    if (!service) {
      throw ServiceResponseCodes.SERVICE_NOT_EXISTS;
    }
    if (service.type === ServiceType.SERVICE) {
      service['serviceProduct'] = await this.getServiceProductsByServiceId(
        service.id,
        true,
      );
    }
    return service;
  }

  getServiceTypesList() {
    return Object.keys(ServiceType).map((i) => {
      return {
        id: ServiceType[i],
        name: ServiceType[i],
      };
    });
  }

  async getServiceProductsByPurchaseId(service: IServiceProductCondition) {
    let where: any = {};
    if (service?.type) {
      where['service'] = { type: service.type };
    }
    if (service.serviceId) {
      where['service'] = { id: service.serviceId };
    }
    if (service?.purchaseIds?.length) {
      where['service'] = {
        ...where['service'],
        purchase: { id: In(service.purchaseIds) },
      };
    }
    if (service?.branchId?.length) {
      where['service'] = {
        ...where['service'],
        branch: { id: In(service.branchId) },
      };
    }
    where['isActive'] = true;

    const serviceProduct: any = await this.serviceProductRepository.find({
      where,
      relations: {
        product: true,
        service: {
          purchase: true,
        },
      },
      select: {
        service: {
          id: true,
          purchase: { id: true },
          branch: { id: true },
        },
        product: { id: true, name: true },
      },
    });
    if (service.withoutGrouping) return serviceProduct;
    let data = await this.serviceProductService.getServiceProduct(
      serviceProduct,
      null,
    );
    return data;
  }

  analyticEvent(data: IServiceAnalyticEvent) {
    this.eventEmitter.emit(Events.SERVICE_ANALYTIC_DATA_ADDED, { data });
  }

}
