import { Inject } from '@nestjs/common';
import { In, QueryRunner } from 'typeorm';
import { PAD_ORDER_TYPE } from '../../common/enums/client';
import { ServiceFiles } from '../../common/enums/services';
import { ServiceProduct } from '../../entities/service-product.entity';
import { Services } from '../../entities/services.entity';
import {
  IFemaleHygieneUnitServiceProduct,
  ISanitaryPadService,
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

export class ServiceProductService {
  constructor(
    private service: ServicesService,
    @Inject(ProductService)
    private productService: ProductService,
  ) {}

  async saveFemaleHygieneUnitProduct(
    femaleHygieneUnit: CreateFemaleHygieneUnitDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!femaleHygieneUnit?.length) return;
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const fhu of femaleHygieneUnit) {
      let product = await this.productService.throwIfProductNotExists(
        fhu.productId,
      );
      const serviceProduct = new ServiceProduct();
      serviceProduct.product = product;
      serviceProduct.serviceFrequency = fhu.serviceType;
      serviceProduct.service = service;
      serviceProduct.totalQuantity = fhu.quantity;
      serviceProduct.installedQuantity = fhu.installedQuantity;
      if (fhu?.serviceType) {
        serviceProduct.serviceFrequency = fhu.serviceType;
      }
      if (fhu.servicedQuantity) {
        serviceProduct.serviceQuantity = fhu.servicedQuantity;
      }
      if (fhu.invoiceAmount) {
        serviceProduct.invoiceAmount = fhu.invoiceAmount;
      }
      if (fhu.isInvoiceSubmitted) {
        serviceProduct.isInvoiceSubmitted = fhu.isInvoiceSubmitted;
      }
      if (fhu.invoiceOther) {
        serviceProduct.invoiceOther = fhu.invoiceOther;
      }
      if (fhu.invoiceNumber) {
        serviceProduct.invoiceNumber = fhu.invoiceNumber;
      }
      if (fhu.installedQuantity) {
        serviceProduct.installedQuantity = fhu.installedQuantity;
      }
      serviceProduct.actualCost = this.calculateActualServiceCost(
        contractStartDate,
        contractEndDate,
        fhu.serviceCost,
        fhu['installedQuantity'] || fhu['servicedQuantity'],
        fhu?.serviceType,
      );

      await queryRunner.manager.save(ServiceProduct, serviceProduct);
      // await this.serviceProductRepository.save(serviceProduct);
    }
  }

  async updateFemaleHygieneUnitProduct(
    femaleHygieneUnit: FemaleHygieneUnitInstallDto[],
    service: Services,
    queryRunner: QueryRunner,
  ) {
    if (!femaleHygieneUnit?.length) return;
    for (const fhu of femaleHygieneUnit) {
      const serviceProduct = new ServiceProduct();
      if (fhu?.serviceType) {
        serviceProduct.serviceFrequency = fhu.serviceType;
      }
      if (fhu.servicedQuantity) {
        serviceProduct.serviceQuantity = fhu.servicedQuantity;
      }
      if (fhu.invoiceAmount) {
        serviceProduct.invoiceAmount = fhu.invoiceAmount;
      }
      if (fhu.isInvoiceSubmitted) {
        serviceProduct.isInvoiceSubmitted = fhu.isInvoiceSubmitted;
      }
      if (fhu.invoiceOther) {
        serviceProduct.invoiceOther = fhu.invoiceOther;
      }
      if (fhu.invoiceNumber) {
        serviceProduct.invoiceNumber = fhu.invoiceNumber;
      }
      if (fhu.installedQuantity) {
        serviceProduct.installedQuantity = fhu.installedQuantity;
      }

      await Promise.all([
        await this.service.uploadServiceFiles(
          {
            fileIds: fhu?.fhuAckInvoiceFileId,
            fileType: ServiceFiles.FHU_SIGNED_ACKNOWLEDGED_INVOICE,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: fhu?.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: fhu?.fhuSignedReportCardFileId,
            fileType: ServiceFiles.FHU_SIGNED_REPORT_CARD,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: fhu?.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: fhu?.fhuDeliveryChallanFileId,
            fileType: ServiceFiles.FHU_SIGNED_DELIVERY_CHALLAN,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: fhu?.serviceProductId,
          },
          queryRunner,
        ),
      ]);
      await queryRunner.manager.update(
        ServiceProduct,
        { id: fhu.serviceProductId },
        serviceProduct,
      );
    }
  }

  async saveVendingMachine(
    vendingMachine: CreateVendingMachineDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!vendingMachine?.length) return;
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    for (const vm of vendingMachine) {
      let product = await this.productService.throwIfProductNotExists(
        vm.productId,
      );
      const serviceProduct = new ServiceProduct();
      serviceProduct.product = product;
      serviceProduct.serviceType = vm.deploymentType;
      serviceProduct.serviceFrequency = vm.serviceType;
      serviceProduct.service = service;
      serviceProduct.totalQuantity = vm.quantity;
      serviceProduct.serviceFrequency = vm.serviceType;
      if (vm.installedQuantity) {
        serviceProduct.installedQuantity = vm.installedQuantity;
      }
      if (vm.machineNumber) {
        serviceProduct.vmMachineNumber = vm.machineNumber;
      }
      if (vm.vmMaintenanceParts) {
        serviceProduct.vmMaintenanceParts = vm.vmMaintenanceParts;
      }
      if (vm.vmMaintenancePartOther) {
        serviceProduct.vmMaintenancePartOther =
        vm.vmMaintenancePartOther;
      }
      if (vm.vmMaintenancePartQty) {
        serviceProduct.vmMaintenancePartQty =
        vm.vmMaintenancePartQty;
      }
      if (vm.invoiceAmount) {
        serviceProduct.invoiceAmount = vm.invoiceAmount;
      }
      if (vm.padRefillingQuantity5Rs) {
        serviceProduct.padRefillingQuantity5Rs =
          vm.padRefillingQuantity5Rs;
      }
      if (vm.padRefillingQuantity10Rs) {
        serviceProduct.padRefillingQuantity10Rs =
          vm.padRefillingQuantity10Rs;
      }
      if (vm.coinRefillingCollection5Rs) {
        serviceProduct.coinRefillingCollection5Rs =
          vm.coinRefillingCollection5Rs;
      }
      if (vm.coinRefillingCollection10Rs) {
        serviceProduct.coinRefillingCollection10Rs =
          vm.coinRefillingCollection10Rs;
      }
      if (vm.padSoldQuantity5Rs) {
        serviceProduct.padSoldQuantity5Rs = vm.padSoldQuantity5Rs;
      }
      if (vm.padSoldQuantity10Rs) {
        serviceProduct.padSoldQuantity10Rs = vm.padSoldQuantity10Rs;
      }
      if (vm.padSoldInvAmount) {
        serviceProduct.padSoldInvAmount = vm.padSoldInvAmount;
      }
      serviceProduct.refillingAmount =
        vm['refillingAmount'] || null;
      serviceProduct.refillingQuantity =
        vm['refillingQuantity'] || null;

        serviceProduct.actualCost = this.calculateActualServiceCost(
          contractStartDate,
          contractEndDate,
          vm.rentalAmount,
          vendingMachine['installedQuantity'] ||
            vendingMachine['servicedQuantity'],
          vm?.serviceType,
        );
      await queryRunner.manager.save(ServiceProduct, serviceProduct);
      //   await this.serviceProductRepository.save(serviceProduct);
    }
  }

  async updateVendingMachine(
    vendingMachines: VendingMachineInstallDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!vendingMachines?.length) return;
    for (const vendingMachine of vendingMachines) {
      const serviceProduct = new ServiceProduct();
      if (vendingMachine.serviceType) {
        serviceProduct.serviceFrequency = vendingMachine.serviceType;
      }
      if (vendingMachine.servicedQuantity) {
        serviceProduct.serviceQuantity = vendingMachine.servicedQuantity;
      }
      if (vendingMachine.installedQuantity) {
        serviceProduct.installedQuantity = vendingMachine.installedQuantity;
      }
      if (vendingMachine.machineNumber) {
        serviceProduct.vmMachineNumber = vendingMachine.machineNumber;
      }
      if (vendingMachine.vmMaintenanceParts) {
        serviceProduct.vmMaintenanceParts = vendingMachine.vmMaintenanceParts;
      }
      if (vendingMachine.vmMaintenancePartOther) {
        serviceProduct.vmMaintenancePartOther =
          vendingMachine.vmMaintenancePartOther;
      }
      if (vendingMachine.vmMaintenancePartQty) {
        serviceProduct.vmMaintenancePartQty =
          vendingMachine.vmMaintenancePartQty;
      }
      if (vendingMachine.invoiceAmount) {
        serviceProduct.invoiceAmount = vendingMachine.invoiceAmount;
      }
      if (vendingMachine.padRefillingQuantity5Rs) {
        serviceProduct.padRefillingQuantity5Rs =
          vendingMachine.padRefillingQuantity5Rs;
      }
      if (vendingMachine.padRefillingQuantity10Rs) {
        serviceProduct.padRefillingQuantity10Rs =
          vendingMachine.padRefillingQuantity10Rs;
      }
      if (vendingMachine.coinRefillingCollection5Rs) {
        serviceProduct.coinRefillingCollection5Rs =
          vendingMachine.coinRefillingCollection5Rs;
      }
      if (vendingMachine.coinRefillingCollection10Rs) {
        serviceProduct.coinRefillingCollection10Rs =
          vendingMachine.coinRefillingCollection10Rs;
      }
      if (vendingMachine.padSoldQuantity5Rs) {
        serviceProduct.padSoldQuantity5Rs = vendingMachine.padSoldQuantity5Rs;
      }
      if (vendingMachine.padSoldQuantity10Rs) {
        serviceProduct.padSoldQuantity10Rs = vendingMachine.padSoldQuantity10Rs;
      }
      if (vendingMachine.padSoldInvAmount) {
        serviceProduct.padSoldInvAmount = vendingMachine.padSoldInvAmount;
      }
      serviceProduct.refillingAmount =
        vendingMachine['refillingAmount'] || null;
      serviceProduct.refillingQuantity =
        vendingMachine['refillingQuantity'] || null;

      await Promise.all([
        await this.service.uploadServiceFiles(
          {
            fileIds: vendingMachine?.vmSalesOrder,
            fileType: ServiceFiles.VM_SALES_ORDER,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: vendingMachine.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: vendingMachine?.vmAckInvoiceFileId,
            fileType: ServiceFiles.VM_SIGNED_ACKNOWLEDGED_INVOICE,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: vendingMachine.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: vendingMachine?.vmSignedReportCardFileId,
            fileType: ServiceFiles.VM_SIGNED_REPORT_CARD,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: vendingMachine.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: vendingMachine?.vmDeliveryChallanFileId,
            fileType: ServiceFiles.VM_SIGNED_DELIVERY_CHALLAN,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: vendingMachine.serviceProductId,
          },
          queryRunner,
        ),
        await queryRunner.manager.update(
          ServiceProduct,
          { id: vendingMachine.serviceProductId },
          serviceProduct,
        ),
      ]);
    }
  }

  async saveSanitaryBuyoutPad(
    sanitaryBuyoutPads: CreateSanitaryPadDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryBuyoutPads?.length) return;
    for (const sanitaryPads of sanitaryBuyoutPads) {
      const serviceProduct = new ServiceProduct();
      serviceProduct.service = service;
      if (sanitaryPads?.padBrand) {
        serviceProduct.padBrand = sanitaryPads.padBrand;
      }
      if (sanitaryPads?.quantity) {
        serviceProduct.padQuantity = sanitaryPads.quantity;
        serviceProduct.totalQuantity = sanitaryPads.quantity;
      }
      if (sanitaryPads?.cost) {
        serviceProduct.padCost = sanitaryPads.cost;
      }
      if (sanitaryPads?.totalCost) {
        serviceProduct.totalCost = sanitaryPads.totalCost;
      }
      if (sanitaryPads.installedQuantity) {
        serviceProduct.installedQuantity = sanitaryPads.installedQuantity;
      }
      serviceProduct.padType = PAD_ORDER_TYPE.SANITARY_PAD;
      return await queryRunner.manager.save(ServiceProduct, serviceProduct);
    }
  }

  async updateSanitaryBuyoutPad(
    sanitaryBuyoutPads: CreateSanitaryPadServiceDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryBuyoutPads?.length) return;
    for (const sanitaryPads of sanitaryBuyoutPads) {
      const serviceProduct = new ServiceProduct();
      if (sanitaryPads?.padBrand) {
        serviceProduct.padBrand = sanitaryPads.padBrand;
      }
      if (sanitaryPads?.quantity) {
        serviceProduct.padQuantity = sanitaryPads.quantity;
      }
      if (sanitaryPads?.cost) {
        serviceProduct.padCost = sanitaryPads.cost;
      }
      if (sanitaryPads?.totalCost) {
        serviceProduct.totalCost = sanitaryPads.totalCost;
      }
      if (sanitaryPads.installedQuantity) {
        serviceProduct.installedQuantity = sanitaryPads.installedQuantity;
      }
      serviceProduct.padType = PAD_ORDER_TYPE.SANITARY_PAD;

      await Promise.all([
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padAckInvoiceFileId,
            fileType: ServiceFiles.SANITARY_PAD_SIGNED_ACKNOWLEDGED_INVOICE,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padSignedReportCardFileId,
            fileType: ServiceFiles.SANITARY_PAD_SIGNED_REPORT_CARD,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padDeliveryChallanFileId,
            fileType: ServiceFiles.SANITARY_PAD_SIGNED_DELIVERY_CHALLAN,
            user: service?.user,
            city: service?.city,
            client: service?.client,
            branch: service?.branch,
            purchase: service?.purchase,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await queryRunner.manager.update(
          ServiceProduct,
          { id: sanitaryPads.serviceProductId },
          serviceProduct,
        ),
      ]);
    }
  }

  async saveVendingMachinePads(
    vmPads: CreateSanitaryPadDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!vmPads?.length) return;
    // const result = vmPads?.reduce((acc : ServiceProduct[],sanitaryPads:CreateSanitaryPadDto)=>{ 
    //   const serviceProduct = new ServiceProduct();
    //   serviceProduct.service = service;
    //   serviceProduct.padBrand = sanitaryPads?.padBrand;
    //   serviceProduct.totalQuantity = sanitaryPads?.quantity;
    //   serviceProduct.padQuantity = sanitaryPads?.quantity;
    //   serviceProduct.padCost = sanitaryPads?.cost;
    //   serviceProduct.totalCost = sanitaryPads?.totalCost;
    //   serviceProduct.padType = PAD_ORDER_TYPE.VENDING_MACHINE_PAD;
    //   serviceProduct.installedQuantity = sanitaryPads.installedQuantity ??=0;
    //   acc.push(serviceProduct)
    //   return acc;
    // },[])
    
    // return await queryRunner.manager.create(ServiceProduct, result);
    for (const sanitaryPads of vmPads) {
      const serviceProduct = new ServiceProduct();
      serviceProduct.service = service;
      serviceProduct.padBrand = sanitaryPads?.padBrand;
      serviceProduct.totalQuantity = sanitaryPads?.quantity;
      serviceProduct.padQuantity = sanitaryPads?.quantity;
      serviceProduct.padCost = sanitaryPads?.cost;
      serviceProduct.totalCost = sanitaryPads?.totalCost;
      serviceProduct.padType = PAD_ORDER_TYPE.VENDING_MACHINE_PAD;
      if (sanitaryPads.installedQuantity) {
        serviceProduct.installedQuantity = sanitaryPads.installedQuantity;
      }
    }
  }

  async updateVendingMachinePads(
    sanitaryBuyoutPads: CreateSanitaryPadServiceDto[],
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryBuyoutPads?.length) return;
    for (const sanitaryPads of sanitaryBuyoutPads) {
      const serviceProduct = new ServiceProduct();
      if (sanitaryPads.padBrand) {
        serviceProduct.padBrand = sanitaryPads.padBrand;
      }
      if (sanitaryPads.quantity) {
        serviceProduct.padQuantity = sanitaryPads.quantity;
      }
      if (sanitaryPads.cost) {
        serviceProduct.padCost = sanitaryPads.cost;
      }
      if (sanitaryPads.totalCost) {
        serviceProduct.totalCost = sanitaryPads.totalCost;
      }
      if (sanitaryPads.installedQuantity) {
        serviceProduct.installedQuantity = sanitaryPads.installedQuantity;
      }
      serviceProduct.padType = PAD_ORDER_TYPE.VENDING_MACHINE_PAD;

      await Promise.all([
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padAckInvoiceFileId,
            fileType: ServiceFiles.VM_PAD_SIGNED_ACKNOWLEDGED_INVOICE,
            user: service.user,
            city: service.city,
            client: service.client,
            branch: service.branch,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padSignedReportCardFileId,
            fileType: ServiceFiles.VM_PAD_SIGNED_REPORT_CARD,
            user: service.user,
            city: service.city,
            client: service.client,
            branch: service.branch,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await this.service.uploadServiceFiles(
          {
            fileIds: sanitaryPads?.padDeliveryChallanFileId,
            fileType: ServiceFiles.VM_PAD_SIGNED_DELIVERY_CHALLAN,
            user: service.user,
            city: service.city,
            client: service.client,
            branch: service.branch,
            service: service,
            serviceProduct: sanitaryPads.serviceProductId,
          },
          queryRunner,
        ),
        await queryRunner.manager.update(
          ServiceProduct,
          { id: sanitaryPads.serviceProductId },
          serviceProduct,
        ),
      ]);
    }
  }

  async saveSimDetails(
    sim: ISimCardServiceDTO,
    service: Services,
    queryRunner?: QueryRunner,
  ) {
    const { createService, updateService } = sim;
    const simRecharge = createService || updateService;
    if (!simRecharge?.length) return;
    for (const sim of simRecharge) {
      const serviceProduct = new ServiceProduct();
      serviceProduct.service = service;
      serviceProduct.simBrand = sim.simBrand;
      serviceProduct.simRechargePrice = sim['price'] || 0;
      serviceProduct.totalQuantity = Boolean(sim?.quantity) && sim?.quantity;
      serviceProduct.installedQuantity = sim['installedQuantity'] || 0;
      serviceProduct.totalCost = sim['totalAmount'] || 0;
      serviceProduct.simNumber = sim['simNumber'] || '';
      return await queryRunner.manager.save(ServiceProduct, serviceProduct);
    }
  }

  async updateSimDetails(
    simRecharge: CreateSimCardServiceDto[],
    service: Services,
    queryRunner?: QueryRunner,
    simServiceProduct?: any[],
  ) {
    if (!simRecharge?.length) return;
    const isInDto = (obj) => {
      return simRecharge.some(
        (item) => item.serviceProductId === obj.serviceProductId,
      );
    };
    const Ids = simServiceProduct
      ?.filter((obj) => !isInDto(obj))
      ?.map((i) => i.serviceProductId);
    await this.deleteServiceProductById(Ids, queryRunner);
    const newSim = [];
    for (const simCard of simRecharge) {
      const serviceProduct = new ServiceProduct();
      serviceProduct.simBrand = simCard.simBrand;
      serviceProduct.installedQuantity = simCard['installedQuantity'] || 0;
      serviceProduct.simRechargePrice = simCard['price'] || 0;
      serviceProduct.simNumber = simCard['simNumber'] || '';
      if (simCard.serviceProductId) {
        await queryRunner.manager.update(
          ServiceProduct,
          { id: simCard.serviceProductId },
          serviceProduct,
        );
      } else {
        newSim.push(simCard);
      }
    }
    if (newSim?.length) {
      await this.saveSimDetails(
        { updateService: newSim },
        service,
        queryRunner,
      );
    }
  }

  async getServiceProduct(serviceProduct: any, files?: any) {
    const response = {
      femaleHygieneUnit: [],
      vendingMachine: [],
      sim: [],
      vendingMachinePads: [],
      sanitaryPads: [],
    };

    const femaleHygieneUnit = await this.productService.getProducts(
      'female_hygiene_unit',
    );
    const vendingMachine =
      await this.productService.getProducts('vending_machine');
    let femaleHygieneUnitIds = femaleHygieneUnit?.map((fhu: any) => fhu.id);
    let vendingMachineIds = vendingMachine?.map((vm: any) => vm.id);
    for (const data of serviceProduct) {
      if (vendingMachineIds?.includes(data?.product?.id)) {
        let vm: IVendingMachineServiceProduct = {};
        vm.serviceProductId = data.id;
        vm.product = {
          id: data?.product?.id,
          name: data?.product.name,
        };
        vm.totalQuantity = data?.totalQuantity;
        vm.installedQuantity = data?.installedQuantity;
        vm.servicedQuantity = data?.serviceQuantity;
        vm.serviceType = data?.serviceType;
        vm.serviceFrequency = data?.serviceFrequency;
        vm.machineNumber = data?.vmMachineNumber;
        vm.invoiceAmount = data?.invoiceAmount;
        vm.padRefillingQuantity5Rs = data.padRefillingQuantity5Rs;
        vm.padRefillingQuantity10Rs = data.padRefillingQuantity10Rs;
        vm.coinRefillingCollection5Rs = data.coinRefillingCollection5Rs;
        vm.coinRefillingCollection10Rs = data.coinRefillingCollection10Rs;
        vm.padSoldQuantity5Rs = data.padSoldQuantity5Rs;
        vm.padSoldQuantity10Rs = data.padSoldQuantity10Rs;
        vm.padSoldInvAmount = data.padSoldInvAmount;
        vm.vmMaintenanceParts = data.vmMaintenanceParts;
        vm.vmMaintenancePartOther = data.vmMaintenancePartOther;
        vm.vmMaintenancePartQty = data.vmMaintenancePartQty;
        vm.vmRefillingAmount = data.refillingAmount;
        vm.vmRefillingQuantity = data.refillingQuantity;
        vm.files =
          files && this.groupFilesByFileType(files[`${parseInt(data.id)}`]);
        response.vendingMachine.push(vm);
      }
      if (femaleHygieneUnitIds?.includes(data?.product?.id)) {
        let fhu: IFemaleHygieneUnitServiceProduct = {};
        fhu.serviceProductId = data.id;
        fhu.product = {
          id: data?.product?.id,
          name: data?.product.name,
        };
        fhu.totalQuantity = data?.totalQuantity;
        fhu.installedQuantity = data?.installedQuantity;
        fhu.servicedQuantity = data?.serviceQuantity;
        fhu.serviceType = data?.serviceType;
        fhu.serviceFrequency = data?.serviceFrequency;
        fhu.invoiceAmount = data?.invoiceAmount;
        fhu.invoiceOther = data?.invoiceOther;
        fhu.isInvoiceSubmitted = data.isInvoiceSubmitted;
        fhu.invoiceNumber = data.invoiceNumber;
        fhu.files =
          files && this.groupFilesByFileType(files[`${parseInt(data.id)}`]);
        response.femaleHygieneUnit.push(fhu);
      }
      if (data.simBrand || data.simNumber || data.simRechargePrice) {
        let simCard: ISimDetailService = {};
        simCard.serviceProductId = data.id;
        simCard.simBrand = data.simBrand;
        simCard.simNumber = data.simNumber;
        simCard.totalQuantity = data?.totalQuantity;
        simCard.installedQuantity = data?.installedQuantity;
        simCard.simRechargePrice = data.simRechargePrice;
        response.sim.push(simCard);
      }

      let sanitaryPads: ISanitaryPadService = {};
      if (data.padType == PAD_ORDER_TYPE.SANITARY_PAD) {
        sanitaryPads.serviceProductId = data.id;
        sanitaryPads.padBrand = data.padBrand;
        sanitaryPads.padQuantity = data.padQuantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        sanitaryPads.totalQuantity = data?.totalQuantity;
        sanitaryPads.installedQuantity = data?.installedQuantity;
        sanitaryPads.files =
          files && this.groupFilesByFileType(files[`${parseInt(data.id)}`]);
        response.sanitaryPads.push(sanitaryPads);
      }
      if (data.padType == PAD_ORDER_TYPE.VENDING_MACHINE_PAD) {
        sanitaryPads.serviceProductId = data.id;
        sanitaryPads.padBrand = data.padBrand;
        sanitaryPads.padQuantity = data.padQuantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        sanitaryPads.totalQuantity = data?.totalQuantity;
        sanitaryPads.installedQuantity = data?.installedQuantity;
        sanitaryPads.files =
          files && this.groupFilesByFileType(files[`${parseInt(data.id)}`]);
        response.vendingMachinePads.push(sanitaryPads);
      }
    }
    return response;
  }

  groupFilesByFileType(data: any) {
    const groupedData = data?.reduce((result: any, item: any) => {
      const fileType = item.fileType;

      if (!result[fileType]) {
        result[fileType] = [];
      }

      result[fileType].push(item);

      return result;
    }, {});
    return groupedData;
  }

  async deleteServiceProductById(ids: number[], queryRunner: QueryRunner) {
    return queryRunner.manager.delete(ServiceProduct, { id: In(ids) });
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
}
