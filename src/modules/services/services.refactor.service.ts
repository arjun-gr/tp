import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  BRANCH_REPOSITORY,
  PADCARE_FILES_REPOSITORY,
  SERVICE_PRODUCT_REPOSITORY,
  SERVICE_REPOSITORY,
} from '../database/database.providers';
import { Inject, forwardRef } from '@nestjs/common';
import { Services } from 'src/entities/services.entity';
import { Branch } from 'src/entities/branch.entity';
import { PadcareFiles } from 'src/entities/padcare-files.entity';
import { ClientService } from '../client/client.service';
import { CityService } from '../city/city.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceProduct } from 'src/entities/service-product.entity';
import { PurchaseService } from '../client/purchase.service';
import { ServiceProductService } from './service-product.refactor.service';
import { CreateMaintenanceServiceDto } from './dto/create-maintaince-services.dto';
import { ServiceStatus, ServiceType } from 'src/common/enums/services';
import { IServiceEntity } from 'src/interfaces/service';
import { plainToClass } from 'class-transformer';

export class ServicesService {
  constructor(
    // @InjectDataSource()
    // private dataSource: DataSource,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
    // @Inject(BRANCH_REPOSITORY)
    // private branchRepository: Repository<Branch>,
    // @Inject(PADCARE_FILES_REPOSITORY)
    // private padcareFileRepository: Repository<PadcareFiles>,
    // private clientService: ClientService,
    // private cityService: CityService,
    // private eventEmitter: EventEmitter2,
    @Inject(SERVICE_PRODUCT_REPOSITORY)
    private serviceProductRepository: Repository<ServiceProduct>,
    // @Inject(forwardRef(() => PurchaseService))
    // private purchaseService: PurchaseService,
    @Inject(forwardRef(() => ServiceProductService))
    private serviceProductService: ServiceProductService,
  ) {}

  async createMaintenanceServices(
    serviceDto: CreateMaintenanceServiceDto[],
    queryRunner: QueryRunner,
  ) {
    if (!serviceDto?.length) return;
    let fhuProducts = [];
    let vmProducts = [];
    const services = [];

    for (let dto of serviceDto) {
      const serviceCreated = await this.saveServiceDetails(dto, queryRunner);
      const fhu =
        await this.serviceProductService.saveFemaleHygieneUnitProduct(
          dto?.femaleHygieneUnit,
          serviceCreated,
          queryRunner,
        );

      fhuProducts.push(fhu[0]);
      
      vmProducts = await this.serviceProductService.saveVendingMachine(
        dto?.vendingMachine,
        serviceCreated,
        queryRunner,
      );

      
      services.push(serviceCreated);
    
    }


    this.serviceRepository.insert(services);
    this.serviceProductRepository.insert([...fhuProducts, ...vmProducts]);

  }

  async saveServiceDetails(
    dto: CreateMaintenanceServiceDto,
    queryRunner?: QueryRunner,
  ) {
    
    const service = this.saveService({
      clientId: dto.clientId,
      branchId: dto.branchId,
      cityId: dto.cityId,
      purchaseId: dto?.purchase?.id,
      purchase:dto?.purchase,
      type: dto.type as ServiceType,
      date: dto.date,
      status: dto.status as ServiceStatus,
      serviceProduct: [],
      actualServiceDate: dto.actualServiceDate,
      rating: dto.rating,
      totalServiceCost: dto.totalServiceCost,
      wastePadCollection: dto.wastePadCollection + '',
      stickers: dto.stickers,
      clientOnboardingProduct: dto.clientOnboardingProduct,
      isInvoiceSubmitted: dto.isInvoiceSubmitted,
      invoiceOther: dto.invoiceOther,
      vehicleUsed: dto.vehicleUsed,
      otherVehicleDetail: dto.otherVehicleDetails,
      binMaintenanceParts: dto.binMaintenancePart,
      binMaintenanceOtherPart: dto.otherBinMaintenancePart,
      binMaintenancePartQty: dto.binMaintenancePartQty,
      invoiceAmount: dto.serviceInvoiceAmount,
      completedAt: dto.completedAt,
    });
    return await queryRunner.manager.save(Services, service);
  }

  saveService(data: Partial<IServiceEntity>) {
    const service: Services = plainToClass(Services, {
      id: data.id,
      client: { id: data.clientId },
      branch: { id: data.branchId },
      city: { id: data.cityId },
      purchase: data.purchase || { id: data.purchaseId },
      serviceProduct: data.serviceProduct,
      type: data.type,
      date: data.date,
      status: data.status,
      actualServiceDate: data.actualServiceDate,
      rating: data.rating,
      totalServiceCost: data.totalServiceCost,
      wastePadCollection: data.wastePadCollection,
      clientOnboardingProduct: data.clientOnboardingProduct,
      isInvoiceSubmitted: data.isInvoiceSubmitted,
      invoiceOther: data.invoiceOther,
      invoiceAmount: data.invoiceAmount,
      vehicleUsed: data.vehicleUsed,
      otherVehicleDetail: data.otherVehicleDetail,
      binMaintenanceParts: data.binMaintenanceParts,
      binMaintenanceOtherPart: data.binMaintenancePartQty,
      binMaintenancePartQty: data.binMaintenancePartQty,
      completedAt: data.completedAt,
    });
    return service;
  }
}
