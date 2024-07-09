import { VM_SERVICE_TYPE } from 'src/common/enums/client';
import { CreateVendingMachineDto } from '../client/dto/vending-machine.dto';
import {
  PRODUCT_INFO,
  misc_const,
  sanitary_pad,
  sim_const,
  vm_const,
  vm_pads,
} from './constants';
import { Injectable } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { CreateSanitaryPadDto } from '../client/dto/sanitary-pad.dto';
import { CreateFemaleHygieneUnitDto } from '../client/dto/female-hygiene-unit.dto';
import { CreateSimCardDto } from '../client/dto/sim-card.dto';
import { CreateSPOCDto } from '../client/dto/create-spoc.dto';

@Injectable()
export class createService {
  constructor(private readonly excelService: ExcelService) {}

  createFhuProductObj(product: any, response: any, productIds: any[]) {
    // console.log(product)
    if (
      product[PRODUCT_INFO.TYPE_OF_BIN] &&
      product[PRODUCT_INFO.BIN_SERVICE_TYPE] &&
      product[PRODUCT_INFO.BIN_QTY] &&
      product[PRODUCT_INFO.BIN_RATE] &&
      product[PRODUCT_INFO.BIN_TOTAL_AMOUNT]
    ) {
      const productId = this.excelService.getProductIdByName(
        productIds,
        product[PRODUCT_INFO.TYPE_OF_BIN],
      );
      const fhu = new CreateFemaleHygieneUnitDto();
      fhu.productId = productId;
      fhu.quantity = product[PRODUCT_INFO.BIN_QTY];
      fhu.serviceCost = product[PRODUCT_INFO.BIN_RATE];
      fhu.totalServiceCost = product[PRODUCT_INFO.BIN_TOTAL_AMOUNT];
      fhu.serviceType = product[PRODUCT_INFO.BIN_SERVICE_TYPE];
      fhu.installedQuantity = product[PRODUCT_INFO.BIN_INSTALLED_QUANTITY];
      response.femaleHygieneUnit.push(fhu);
    }
  }

  createVMProductObj(product: any, response: any, productIds: any[]) {
    if (
      product[vm_const.TYPE_OF_VM] &&
      product[vm_const.VM_DEPLOYMENT_TYPE] &&
      product[vm_const.VM_QTY] &&
      (product[vm_const.VM_BUYOUT_AMT] || product[vm_const.VM_RENTAL_AMT]) &&
      product[vm_const.VM_TOTAL_AMT]
    ) {
      const productId = this.excelService.getProductIdByName(
        productIds,
        product[vm_const.TYPE_OF_VM],
      );
      const vm = new CreateVendingMachineDto();
      vm.productId = productId;
      vm.quantity = product[vm_const.VM_QTY];
      vm.rentalAmount = product[vm_const.VM_RENTAL_AMT];
      vm.buyoutAmount = product[vm_const.VM_BUYOUT_AMT];
      vm.totalServiceCost = product[vm_const.VM_TOTAL_AMT];
      vm.deploymentType =
        product[vm_const.VM_DEPLOYMENT_TYPE] == VM_SERVICE_TYPE.RENTAL
          ? VM_SERVICE_TYPE.RENTAL
          : VM_SERVICE_TYPE.BUYOUT;
      vm.serviceType = product[vm_const.VM_SERVICE_FREQUENCY];
      vm.installedQuantity = product[vm_const.VM_INSTALLED_QTY];
      response.vendingMachine.push(vm);
    }
  }

  createVMPadProductsObj(product: any, response: any) {
    if (
      product[vm_pads.VM_PAD_BRAND] &&
      product[vm_pads.VM_PAD_QTY] &&
      product[vm_pads.VM_PAD_COST] &&
      product[vm_pads.VM_PAD_TOTAL_COST]
    ) {
      const vmPad = new CreateSanitaryPadDto();
      vmPad.padBrand = product[vm_pads.VM_PAD_BRAND];
      vmPad.quantity = product[vm_pads.VM_PAD_QTY];
      vmPad.cost = product[vm_pads.VM_PAD_COST];
      vmPad.totalCost = product[vm_pads.VM_PAD_TOTAL_COST];
      vmPad.installedQuantity = product[vm_pads.VM_PADS_INSTALLED_QTY];
      response.vendingMachinePads.push(vmPad);
    }
  }

  async createSanitaryPadsObj(product: any, response: any) {
    if (
      product[sanitary_pad.SANITARY_PAD_BRAND] &&
      product[sanitary_pad.SANITARY_PAD_QTY] &&
      product[sanitary_pad.SANITARY_PAD_COST] &&
      product[sanitary_pad.SANITARY_PAD_TOTAL_COST]
    ) {
      const sanitaryPad = new CreateSanitaryPadDto();
      sanitaryPad.padBrand = product[sanitary_pad.SANITARY_PAD_BRAND];
      sanitaryPad.quantity = product[sanitary_pad.SANITARY_PAD_QTY];
      sanitaryPad.cost = product[sanitary_pad.SANITARY_PAD_COST];
      sanitaryPad.totalCost = product[sanitary_pad.SANITARY_PAD_TOTAL_COST];
      sanitaryPad.installedQuantity = product[sanitary_pad.SANITARY_PAD_QTY];
      response.sanitaryPads.push(sanitaryPad);
    }
  }

  async createSimSectionObj(product: any, response: any) {
    if (
      product[sim_const.SIM_BRAND] &&
      product[sim_const.SIM_QTY] &&
      product[sim_const.SIM_PRICE]
    ) {
      const sim = new CreateSimCardDto();
      sim.simNumber = product[sim_const.SIM_NUMBER];
      sim.simBrand = product[sim_const.SIM_BRAND];
      sim.quantity = product[sim_const.SIM_QTY];
      sim.price = product[sim_const.SIM_PRICE];
      sim.totalAmount =
        parseInt(product[sim_const.SIM_PRICE]) *
        parseInt(product[sim_const.SIM_QTY]);
      response.sim.push(sim);
    }
  }

  async createSPOCSectionObj(product: any[], response: any) {
    if (product['SPOC Name']) {
      const spoc = new CreateSPOCDto();
      spoc.name = product[misc_const.SPOC_NAME];
      spoc.email = product[misc_const.SPOC_EMAIL];
      spoc.phoneNumber = product[misc_const.SPOC_PHONE];
      response.spoc.push(spoc);
    }
  }
}
