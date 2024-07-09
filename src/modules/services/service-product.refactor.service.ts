import { Inject } from '@nestjs/common';
import { In, QueryRunner, Repository } from 'typeorm';
import { PAD_ORDER_TYPE, VM_SERVICE_TYPE } from '../../common/enums/client';
import { ServiceFiles } from '../../common/enums/services';
import { ServiceProduct } from '../../entities/service-product.entity';
import { Services } from '../../entities/services.entity';
import {
  IFemaleHygieneUnitServiceProduct,
  ISanitaryPadService,
  IServiceProductEntity,
  ISimCardServiceDTO,
  ISimDetailService,
  IVendingMachineServiceProduct,
} from '../../interfaces/service';
import { CreateFemaleHygieneUnitDto } from '../client/dto/female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from '../client/dto/sanitary-pad.dto';
import { CreateVendingMachineDto } from '../client/dto/vending-machine.dto';
import { ProductService } from '../product/product.service';
import { FemaleHygieneUnitInstallDto } from './dto/fhu-installation.dto';
import { CreateSanitaryPadServiceDto } from './dto/sanitary-pad-service.dto';
import { CreateSimCardServiceDto } from './dto/sim-card-service.dto';
import { VendingMachineInstallDto } from './dto/vm-installation.dto';
import { ServicesService } from './services.service';
import { calculateCost } from 'src/utils/app.utils';
import { SERVICE_PRODUCT_REPOSITORY } from '../database/database.providers';
import { plainToClass } from 'class-transformer';

export class ServiceProductService {
  constructor(
    private service: ServicesService,
    @Inject(ProductService)
    private productService: ProductService,
    @Inject(SERVICE_PRODUCT_REPOSITORY)
    private serviceProductRepository: Repository<ServiceProduct>,
  ) {}

  async saveFemaleHygieneUnitProduct(
    femaleHygieneUnit: CreateFemaleHygieneUnitDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!femaleHygieneUnit?.length) return [];
    const products:ServiceProduct[] = [];
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const product of femaleHygieneUnit) {
      const serviceProd = this.saveServiceProducts({
        service: service,
        serviceId: service.id,
        productId: product.productId,
        serviceFrequency: product.serviceType,
        totalQuantity: product.quantity,
        installedQuantity: product.installedQuantity,
        serviceQuantity: product.servicedQuantity,
        invoiceAmount: product.invoiceAmount,
        isInvoiceSubmitted: product.isInvoiceSubmitted,
        invoiceOther: product.invoiceOther,
        invoiceNumber: product.invoiceNumber,
        actualCost: this.calculateActualServiceCost(
          contractStartDate,
          contractEndDate,
          product.serviceCost,
          product.installedQuantity || product.servicedQuantity,
          product?.serviceType,
        ),
      });
      products.push(serviceProd);
      
    }
    
    return products;
  }

  async saveVendingMachine(
    vendingMachine: CreateVendingMachineDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!vendingMachine?.length) return [];
    const products:ServiceProduct[] = [];
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const product of vendingMachine) {
      const serviceProd = this.saveServiceProducts({
        service: service,
        serviceId: service.id,
        productId: product.productId,
        serviceType: product.deploymentType as VM_SERVICE_TYPE,
        serviceFrequency: product.serviceType,
        totalQuantity: product.quantity,
        installedQuantity: product.installedQuantity,
        vmMachineNumber: product.machineNumber,
        vmMaintenanceParts: product.vmMaintenanceParts,
        vmMaintenancePartOther: product.vmMaintenancePartOther,
        vmMaintenancePartQty: parseInt(product.vmMaintenancePartQty),
        invoiceAmount: product.invoiceAmount,
        padRefillingQuantity5Rs: product.padRefillingQuantity5Rs,
        padRefillingQuantity10Rs: product.coinRefillingCollection10Rs,
        coinRefillingCollection5Rs: product.coinRefillingCollection5Rs,
        coinRefillingCollection10Rs: product.coinRefillingCollection10Rs,
        padSoldQuantity5Rs: product.padSoldQuantity5Rs,
        padSoldQuantity10Rs: product.padSoldQuantity10Rs,
        padSoldInvAmount: product.padSoldInvAmount,
        refillingAmount: product.refillingAmount,
        refillingQuantity: product.refillingQuantity,
        actualCost: this.calculateActualServiceCost(
          contractStartDate,
          contractEndDate,
          product.rentalAmount,
          product?.installedQuantity || product?.servicedQuantity,
          product?.serviceType,
        ),
      });
      products.push(serviceProd);
    }
    return products;
  }

  async saveSanitaryBuyoutPad(
    sanitaryBuyoutPads: CreateSanitaryPadDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryBuyoutPads?.length) return;
    const products:ServiceProduct[] = [];
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const product of sanitaryBuyoutPads) {
      const serviceProd = this.saveServiceProducts({
        service: service,
        serviceId: service.id,
        padBrand: product.padBrand,
        padType: PAD_ORDER_TYPE.SANITARY_PAD,
        padQuantity: product.quantity,
        totalQuantity: product.quantity,
        padCost: product.cost,
        totalCost: product.totalCost,
        actualCost: this.calculateActualServiceCost(
          contractStartDate,
          contractEndDate,
          product.cost,
          product?.installedQuantity,
        ),
      });
      products.push(serviceProd);
    }
    return products;
  }

  async saveVendingMachinePads(
    vmPads: CreateSanitaryPadDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!vmPads?.length) return;
    const products:ServiceProduct[] = [];
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const product of vmPads) {
      const serviceProd = this.saveServiceProducts({
        service: service,
        serviceId: service.id,
        padBrand: product.padBrand,
        padType: PAD_ORDER_TYPE.VENDING_MACHINE_PAD,
        padQuantity: product.quantity,
        totalQuantity: product.quantity,
        padCost: product.cost,
        totalCost: product.totalCost,
        actualCost: this.calculateActualServiceCost(
          contractStartDate,
          contractEndDate,
          product.cost,
          product?.installedQuantity,
        ),
      });
      products.push(serviceProd);
    }
    return products;
  }

  async saveSimDetails(
    sim: ISimCardServiceDTO,
    service: Services,
    queryRunner?: QueryRunner,
  ) {
  
    const { createService, updateService } = sim;
    const simRecharge = createService || updateService;
    if (!simRecharge?.length) return;
    const products:ServiceProduct[] = [];
    for (const product of simRecharge) {
      const serviceProd = this.saveServiceProducts({
        service: service,
        serviceId: service.id,
        simBrand: product.simBrand,
        simRechargePrice: product?.price,
        totalQuantity: product?.quantity,
        simNumber: product?.simNumber,
        installedQuantity: product?.installedQuantity,
        totalCost: product?.totalAmount,
      });
      products.push(serviceProd);
    }
    return products;
  }

  calculateActualServiceCost(
    contractStartDate: Date,
    contractEndDate: Date,
    costPerUnit: number,
    quantity: number,
    serviceType?: string,
  ) {

    let actualCost = null;
    if (contractEndDate && contractStartDate && quantity && costPerUnit) {
      actualCost = calculateCost(
        contractStartDate,
        contractEndDate,
        quantity,
        costPerUnit,
        serviceType,
      );
    }
    return actualCost;
  }

  saveServiceProducts(data: Partial<IServiceProductEntity>) {
    const serviceProduct: ServiceProduct = plainToClass(ServiceProduct, {
      service: data?.service || { id: data?.serviceId },
      product: { id: data.productId },
      totalQuantity: data.totalQuantity,
      installedQuantity: data.installedQuantity,
      serviceQuantity: data.serviceQuantity,
      serviceType: data.serviceType,
      serviceFrequency: data.serviceFrequency,
      invoiceAmount: data.invoiceAmount,
      isInvoiceSubmitted: data.isInvoiceSubmitted,
      invoiceOther: data.invoiceOther,
      invoiceNumber: data.invoiceNumber,
      padRefillingQuantity5Rs: data.padRefillingQuantity5Rs,
      padRefillingQuantity10Rs: data.padRefillingQuantity10Rs,
      coinRefillingCollection5Rs: data.coinRefillingCollection5Rs,
      coinRefillingCollection10Rs: data.coinRefillingCollection10Rs,
      padSoldQuantity5Rs: data.padSoldQuantity5Rs,
      padSoldQuantity10Rs: data.padSoldQuantity10Rs,
      padSoldInvAmount: data.padSoldInvAmount,
      simBrand: data.simBrand,
      simNumber: data.simNumber,
      simRechargePrice: data.simRechargePrice,
      padBrand: data.padBrand,
      padQuantity: data.padQuantity,
      padCost: data.padCost,
      totalCost: data.totalCost,
      padType: data.padType,
      vmMachineNumber: data.vmMachineNumber,
      vmMaintenanceParts: data.vmMaintenanceParts,
      vmMaintenancePartQty: data.vmMaintenancePartQty,
      vmMaintenancePartOther: data.vmMaintenancePartOther,
      refillingQuantity: data.refillingQuantity,
      refillingAmount: data.refillingAmount,
      actualCost: data.actualCost,
      branchProduct: { id: data.branchProductId },
    });
    return this.serviceProductRepository.create(serviceProduct);
  }
}
