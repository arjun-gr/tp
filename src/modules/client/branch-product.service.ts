import { Inject, forwardRef } from '@nestjs/common';
import { In, QueryRunner, Repository } from 'typeorm';
import { PAD_ORDER_TYPE } from '../../common/enums/client';
import { ContractStatus } from '../../common/enums/contract';
import { BranchProduct } from '../../entities/branch-products.entity';
import { Branch } from '../../entities/branch.entity';
import { Purchase } from '../../entities/purchase.entity';
import {
  IBranchProduct,
  ICreateFemaleHygieneUnit,
  ICreateSanitaryPad,
  ICreateVendingMachine,
  IFemaleHygieneUnitProduct,
  IPads,
  ISimDetail,
  IVendingMachineProduct,
} from '../../interfaces/purchase';
import { BRANCH_PRODUCT_REPOSITORY } from '../database/database.providers';
import { ProductService } from '../product/product.service';
import { BranchContractRequestDto } from './dto/branch-new-request.dto';
import { CreateFemaleHygieneUnitDto } from './dto/female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from './dto/sanitary-pad.dto';
import { CreateSimCardDto } from './dto/sim-card.dto';
import { CreateVendingMachineDto } from './dto/vending-machine.dto';
import { createBranchProductsEntity } from './branch-product.refactor.services';

export class BranchProductService {
  constructor(
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(BRANCH_PRODUCT_REPOSITORY)
    private branchProductsRepository: Repository<BranchProduct>,
  ) {}

  async saveFemaleHygieneUnitProduct(
    femaleHygieneUnit: CreateFemaleHygieneUnitDto[],
    purchase: Purchase,
    branch: Branch,
    queryRunner?: QueryRunner,
  ) {
    if (!femaleHygieneUnit?.length) return;
    for (const key of femaleHygieneUnit) {
      const product = await this.productService.throwIfProductNotExists(
        key.productId,
      );

      const branchProduct = new BranchProduct();
      branchProduct.purchase = purchase;
      branchProduct.branch = branch;
      branchProduct.product = product;
      branchProduct.quantity = key.quantity;
      branchProduct.serviceCost = key?.serviceCost ? key.serviceCost : null;
      branchProduct.totalCost = key?.totalServiceCost
        ? key.totalServiceCost
        : null;
      branchProduct.serviceType = key.serviceType;
      branchProduct.status = ContractStatus.ACTIVE;
      if (key.branchProductId) {
        await queryRunner.manager.update(
          BranchProduct,
          { id: key.branchProductId },
          branchProduct,
        );
      } else {
        await queryRunner.manager.save(BranchProduct, branchProduct);
      }
      // await this.branchProductsRepository.save(branchProduct);
    }
  }

  async saveVendingMachine(
    vendingMachine: CreateVendingMachineDto[],
    purchase: Purchase,
    branch: Branch,
    queryRunner?: QueryRunner,
  ) {
    if (!vendingMachine?.length) return;
    for (const key of vendingMachine) {
      const branchProduct = new BranchProduct();
      const product = await this.productService.throwIfProductNotExists(
        key.productId,
      );
      branchProduct.purchase = purchase;
      branchProduct.branch = branch;
      branchProduct.product = product;
      branchProduct.buyoutAmount = key.buyoutAmount ? key.buyoutAmount : null;
      branchProduct.serviceType = key.serviceType;
      branchProduct.deploymentType = key.deploymentType;
      branchProduct.quantity = key.quantity;
      branchProduct.totalCost = key.totalServiceCost
        ? key.totalServiceCost
        : null;
      branchProduct.rentalAmount = key.rentalAmount ? key.rentalAmount : null;
      branchProduct.refillingAmount = key.refillingAmount || null;
      branchProduct.refillingQuantity = key?.refillingQuantity
        ? key.refillingQuantity
        : null;
      branchProduct.status = ContractStatus.ACTIVE;
      if (key.branchProductId) {
        await queryRunner.manager.update(
          BranchProduct,
          { id: key.branchProductId },
          branchProduct,
        );
      } else {
        await queryRunner.manager.save(BranchProduct, branchProduct);
      }
      // await this.branchProductsRepository.save(branchProduct);
    }
  }

  async saveSanitaryBuyoutPad(
    sanitaryPads: CreateSanitaryPadDto[],
    purchase: Purchase,
    branch: Branch,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryPads?.length) return;
    for (const key of sanitaryPads) {
      const branchProduct = new BranchProduct();
      branchProduct.purchase = purchase;
      branchProduct.branch = branch;
      branchProduct.sanitaryPadBrand = key.padBrand;
      branchProduct.quantity = key.quantity;
      branchProduct.padCost = key?.cost ? key.cost : null;
      branchProduct.totalCost = key?.totalCost ? key.totalCost : null;
      branchProduct.padType = PAD_ORDER_TYPE.SANITARY_PAD;
      if (key.branchProductId) {
        await queryRunner.manager.update(
          BranchProduct,
          { id: key.branchProductId },
          branchProduct,
        );
      } else {
        await queryRunner.manager.save(BranchProduct, branchProduct);
      }
      // await this.branchProductsRepository.save(branchProduct);
    }
  }

  async saveVendingMachinePads(
    sanitaryPads: CreateSanitaryPadDto[],
    purchase: Purchase,
    branch: Branch,
    queryRunner?: QueryRunner,
  ) {
    if (!sanitaryPads?.length) return;
    for (const key of sanitaryPads) {
      const branchProduct = new BranchProduct();
      branchProduct.purchase = purchase;
      branchProduct.branch = branch;
      branchProduct.sanitaryPadBrand = key.padBrand;
      branchProduct.quantity = key.quantity;
      branchProduct.padCost = key?.cost ? key.cost : null;
      branchProduct.totalCost = key?.totalCost ? key.totalCost : null;
      branchProduct.padType = PAD_ORDER_TYPE.VENDING_MACHINE_PAD;
      if (key.branchProductId) {
        await queryRunner.manager.update(
          BranchProduct,
          { id: key.branchProductId },
          branchProduct,
        );
      } else {
        await queryRunner.manager.save(BranchProduct, branchProduct);
      }
      // await this.branchProductsRepository.save(branchProduct);
    }
  }

  async saveSimDetails(
    simRecharge: CreateSimCardDto[],
    purchase: Purchase,
    branch: Branch,
    queryRunner?: QueryRunner,
  ) {
    if (!simRecharge?.length) return;
    for (const key of simRecharge) {
      const branchProduct = new BranchProduct();
      branchProduct.purchase = purchase;
      branchProduct.branch = branch;
      branchProduct.simCardBrand = key.simBrand;
      branchProduct.quantity = key.quantity;
      branchProduct.simCardRechargePrice = key.price;
      branchProduct.totalCost = key.totalAmount;
      // branchProduct.simNumber = key.simNumber;
      if (key.branchProductId) {
        await queryRunner.manager.update(
          BranchProduct,
          { id: key.branchProductId },
          branchProduct,
        );
      } else {
        await queryRunner.manager.save(BranchProduct, branchProduct);
      }
      // await this.branchProductsRepository.save(branchProduct);
    }
  }

  async getBranchProduct(branchProduct: any, serviceProduct: any = []) {
    const response: IBranchProduct = {
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
    const femaleHygieneUnitIds = femaleHygieneUnit?.map((fhu: any) => fhu.id);
    const vendingMachineIds = vendingMachine?.map((vm: any) => vm.id);

    for (const data of branchProduct) {
      if (vendingMachineIds?.includes(data?.product?.id)) {
        const service = serviceProduct.find(
          (val: any) => val?.product?.id == data?.product?.id,
        );
        const vm: IVendingMachineProduct = {};
        vm.branchProductId = data.id;
        vm.productId = data?.product?.id;
        vm.productName = data?.product.name;
        vm.quantity = data.quantity;
        vm.refillingAmount = data?.refillingAmount;
        vm.refillingQuantity = data?.refillingQuantity;
        vm.serviceType = data?.deploymentType;
        vm.serviceFrequency = data?.serviceType;
        vm.buyoutAmount = data?.buyoutAmount;
        vm.rentalAmount = data?.rentalAmount;
        vm.totalCost = data?.totalCost;
        vm.installedQuantity = service?.installedQuantity;
        response.vendingMachine.push(vm);
      }
      if (femaleHygieneUnitIds?.includes(data?.product?.id)) {
        const service = serviceProduct.find(
          (val: any) => val?.product?.id == data?.product?.id,
        );
        const fhu: IFemaleHygieneUnitProduct = {};
        fhu.branchProductId = data.id;
        fhu.productId = data?.product?.id;
        fhu.productName = data?.product.name;
        fhu.quantity = data?.quantity;
        fhu.serviceCost = data?.serviceCost;
        fhu.serviceFrequency = data?.serviceType;
        fhu.totalCost = data?.totalCost;
        fhu.installedQuantity = service?.installedQuantity;
        response.femaleHygieneUnit.push(fhu);
      }
      if (data.simCardRechargePrice && data.quantity) {
        const simCard: ISimDetail = {};
        simCard.branchProductId = data.id;
        simCard.simBrand = data.simCardBrand;
        simCard.quantity = data.quantity;
        simCard.installedQuantity = data.installedQuantity;
        simCard.simNumber = data.simNumber;
        simCard.totalAmount = data.totalCost;
        simCard.simRechargePrice = data.simCardRechargePrice;
        response.sim.push(simCard);
      }

      const sanitaryPads: IPads = {};
      if (data.padType == PAD_ORDER_TYPE.SANITARY_PAD) {
        const service = serviceProduct.find(
          (val: any) => val?.padType == PAD_ORDER_TYPE.SANITARY_PAD,
        );
        sanitaryPads.branchProductId = data.id;
        sanitaryPads.padBrand = data.sanitaryPadBrand;
        sanitaryPads.padQuantity = data.quantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        sanitaryPads.padType = data.padType;
        sanitaryPads.installedQuantity = service?.installedQuantity;
        response.sanitaryPads.push(sanitaryPads);
      }
      if (data.padType == PAD_ORDER_TYPE.VENDING_MACHINE_PAD) {
        const service = serviceProduct.find(
          (val: any) => val?.padType == PAD_ORDER_TYPE.VENDING_MACHINE_PAD,
        );
        sanitaryPads.branchProductId = data.id;
        sanitaryPads.padBrand = data.sanitaryPadBrand;
        sanitaryPads.padQuantity = data.quantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        sanitaryPads.padType = data.padType;
        sanitaryPads.installedQuantity = service?.installedQuantity;
        response.vendingMachinePads.push(sanitaryPads);
      }
    }
    return response;
  }

  async formatBranchProductResponse(
    purchases: Purchase[],
    serviceProduct: any = [],
    isMerged: boolean = true,
  ) {
    const response = {
      femaleHygieneUnit: [],
      vendingMachine: [],
      sim: [],
      vendingMachinePads: [],
      sanitaryPads: [],
    };

    for (const purchase of purchases) {
      const branchProduct: IBranchProduct = await this.getBranchProduct(
        purchase.branchProduct,
        serviceProduct,
      );
      if (branchProduct?.femaleHygieneUnit?.length) {
        const fhu = branchProduct?.femaleHygieneUnit.map((fhu: any) => {
          return {
            productId: fhu?.productId,
            quantity: fhu?.quantity,
            serviceType: fhu?.serviceFrequency,
            serviceCost: fhu?.serviceCost,
            totalServiceCost: fhu?.totalCost,
            installedQuantity: fhu?.installedQuantity,
          } as ICreateFemaleHygieneUnit;
        });
        response.femaleHygieneUnit.push(...fhu);
      }
      if (branchProduct?.vendingMachine?.length) {
        const vm = branchProduct?.vendingMachine.map((vm: any) => {
          return {
            productId: vm?.productId,
            quantity: vm?.quantity,
            serviceType: vm?.serviceFrequency,
            deploymentType: vm?.serviceType,
            rentalAmount: vm?.rentalAmount,
            buyoutAmount: vm?.buyoutAmount,
            refillingQuantity: vm?.refillingAmount,
            refillingAmount: vm?.refillingAmount,
            totalServiceCost: vm?.totalCost,
            installedQuantity: vm?.installedQuantity,
          } as ICreateVendingMachine;
        });
        response.vendingMachine.push(...vm);
      }
      if (branchProduct?.vendingMachinePads?.length) {
        const vmPads = branchProduct?.vendingMachinePads.map((pad: any) => {
          return {
            padBrand: pad?.padBrand,
            quantity: pad?.padQuantity,
            cost: pad?.padCost,
            totalCost: pad?.totalCost,
            installedQuantity: pad?.installedQuantity,
          } as ICreateSanitaryPad;
        });
        response.vendingMachinePads.push(...vmPads);
      }
      if (branchProduct?.sanitaryPads?.length) {
        const sanitaryPads = branchProduct?.sanitaryPads.map((pad: any) => {
          return {
            padBrand: pad?.padBrand,
            quantity: pad?.padQuantity,
            cost: pad?.padCost,
            totalCost: pad?.totalCost,
            installedQuantity: pad?.installedQuantity,
          } as ICreateSanitaryPad;
        });
        response.sanitaryPads.push(...sanitaryPads);
      }
      if (branchProduct?.sim?.length) {
        const sim = branchProduct.sim.map((simDetails: any) => {
          return {
            simBrand: simDetails?.simBrand,
            simNumber: simDetails?.simNumber,
            price: simDetails?.simRechargePrice,
            installedQuantity: simDetails?.installedQuantity,
          } as ISimDetail;
        });
        response.sim.push(...sim);
      }
    }
    if (isMerged) {
      response.femaleHygieneUnit = this.mergeProducts(
        response.femaleHygieneUnit,
      );
      response.vendingMachine = this.mergeProducts(response.vendingMachine);
    }
    return response;
  }

  mergeProducts(product: any[]) {
    const productIdSet = new Set();
    const productData = product.reduce((acc, item) => {
      const existingItemIndex = acc.findIndex(
        (element) =>
          element.productId === item.productId &&
          element.serviceType === item.serviceType,
      );
      if (existingItemIndex !== -1) {
        acc[existingItemIndex].quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

    for (const item of productData) {
      if (productIdSet.has(item.productId)) {
        throw new Error(
          `Error: Duplicate productId ${item.productId} with different service type found`,
        );
      } else {
        productIdSet.add(item.productId);
      }
    }

    return productData;
  }

  async removeProductFromContract(
    queryRunner: QueryRunner,
    branchProducts: IBranchProduct,
    dto: BranchContractRequestDto,
  ) {
    const productIds = [];
    const bpFhuIds = branchProducts?.femaleHygieneUnit
      ?.map((key: any) => key.branchProductId)
      ?.filter(Boolean);
    const bpVmIds = branchProducts?.vendingMachine
      ?.map((key: any) => key.branchProductId)
      ?.filter(Boolean);
    const bpVmPadsIds = branchProducts?.vendingMachinePads
      ?.map((key: any) => key.branchProductId)
      ?.filter(Boolean);
    const bpSpadsIds = branchProducts?.sanitaryPads
      ?.map((key: any) => key.branchProductId)
      ?.filter(Boolean);
    const bpSimIds = branchProducts?.sim
      ?.map((key: any) => key.branchProductId)
      ?.filter(Boolean);
    if (dto?.femaleHygieneUnit?.length) {
      for (const fhu of dto.femaleHygieneUnit) {
        if (!bpFhuIds.includes(fhu.branchProductId)) {
          productIds.push(fhu.branchProductId);
        }
      }
    } else {
      bpFhuIds?.length ? productIds.push(...bpFhuIds) : null;
    }
    if (dto?.vendingMachine?.length) {
      for (const vm of dto.vendingMachine) {
        if (!bpVmIds.includes(vm.branchProductId)) {
          productIds.push(vm.branchProductId);
        }
      }
    } else {
      bpVmIds?.length ? productIds.push(...bpVmIds) : null;
    }
    if (dto?.vmPads?.length) {
      for (const vmPads of dto.vmPads) {
        if (!bpVmPadsIds.includes(vmPads.branchProductId)) {
          productIds.push(vmPads.branchProductId);
        }
      }
    } else {
      bpVmPadsIds?.length ? productIds.push(...bpVmPadsIds) : null;
    }
    if (dto?.sanitaryPads?.length) {
      for (const pads of dto.sanitaryPads) {
        if (!bpSpadsIds.includes(pads.branchProductId)) {
          productIds.push(pads.branchProductId);
        }
      }
    } else {
      bpSpadsIds?.length ? productIds.push(...bpSpadsIds) : null;
    }
    if (dto?.simRecharge) {
      for (const sim of dto.simRecharge) {
        if (!bpSimIds.includes(sim.branchProductId)) {
          productIds.push(sim.branchProductId);
        }
      }
    } else {
      bpSimIds?.length ? productIds.push(...bpSimIds) : null;
    }
    const ids = productIds?.filter(Boolean);
    if (ids && ids?.length) {
      await queryRunner.manager.delete(BranchProduct, { id: In(ids) });
    }
  }

  async deleteBranchProductsByPurchaseId(
    purchaseId: number,
    currentDate: Date = new Date(),
  ) {
    return await this.branchProductsRepository.update(
      { purchase: { id: purchaseId } },
      {
        isActive: false,
        deletedAt: currentDate,
      },
    );
  }

  async deactivateBranchProductsByPurchase(
    purchaseId: number | number[],
    status: boolean = false,
  ) {
    const where: any = {};
    const updateValue = { isActive: status };

    if (typeof purchaseId == 'number') {
      where['purchase'] = { id: purchaseId };
    }
    if (Array.isArray(purchaseId)) {
      where['purchase'] = { id: In(purchaseId) };
    }

    await this.branchProductsRepository.update(where, updateValue);
  }

  async getProductByPurchase(purchases: Purchase[]) {
    if (!purchases?.length) return [];
    const product = [];
    for (const purchase of purchases) {
      const prod = await this.getBranchProduct(purchase.branchProduct);
      if (prod?.femaleHygieneUnit?.length) {
        const fhu = prod?.femaleHygieneUnit?.map((val) => ({
          id: val.productId,
          name: val.productName,
        }));
        product.push(...fhu);
      }
      if (prod?.vendingMachine?.length) {
        const vm = prod?.vendingMachine?.map((val) => ({
          id: val.productId,
          name: val.productName,
        }));
        product.push(...vm);
      }
    }
    return product;
  }
}
