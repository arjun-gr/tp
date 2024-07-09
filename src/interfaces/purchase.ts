import { PAD_ORDER_TYPE } from '../common/enums/client';
import { AddBranchDto } from '../modules/client/dto/add-branch.dto';
import { BranchContractRequestDto } from '../modules/client/dto/branch-new-request.dto';
import { CreateClientDto } from '../modules/client/dto/create-client.dto';

export interface IBranchProduct {
  femaleHygieneUnit?: IFemaleHygieneUnitProduct[];
  vendingMachine?: any[];
  sim?: ISimDetail[];
  vendingMachinePads?: IVendingMachineProduct[];
  sanitaryPads?: IPads[];
}

export interface IPurchaseDTO {
  addClient?: CreateClientDto;
  addBranch?: AddBranchDto;
  addContract?: BranchContractRequestDto;
}

export interface IVendingMachineProduct {
  productId?: any;
  productName?: any;
  quantity?: any;
  refillingAmount?: any;
  refillingQuantity?: any;
  serviceType?: any;
  serviceFrequency?: any;
  buyoutAmount?: any;
  rentalAmount?: any;
  totalCost?: any;
  branchProductId?: number;
  installedQuantity?: number;
}

export interface IFemaleHygieneUnitProduct {
  productId?: any;
  productName?: any;
  quantity?: any;
  serviceCost?: any;
  serviceFrequency?: any;
  totalCost?: any;
  branchProductId?: number;
  installedQuantity?: number;
}

export interface ISimDetail {
  simBrand?: any;
  quantity?: number;
  simNumber?: any;
  simRechargePrice?: any;
  price?: number;
  totalAmount?: number;
  branchProductId?: number;
  installedQuantity?: number;
}

export interface IPads {
  padBrand?: any;
  padQuantity?: any;
  padCost?: any;
  totalCost?: any;
  padType?: PAD_ORDER_TYPE;
  branchProductId?: number;
  installedQuantity?: number;
}

export interface ICreateFemaleHygieneUnit {
  productId: number;
  quantity: number;
  serviceType?: string;
  serviceCost?: number;
  totalServiceCost?: number;
  installedQuantity?: number;
}

export interface ICreateVendingMachine {
  productId: number;
  quantity: number;
  serviceType?: string;
  deploymentType?: string;
  rentalAmount?: number;
  buyoutAmount?: number;
  refillingQuantity?: number;
  refillingAmount?: number;
  totalServiceCost?: number;
  installedQuantity?: number;
}

export interface ICreateSanitaryPad {
  padBrand: string;
  quantity: number;
  cost?: number;
  totalCost?: number;
  installedQuantity?: number;
}
