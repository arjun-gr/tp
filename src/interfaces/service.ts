import { QueryRunner } from 'typeorm';
import { ServiceStatus, ServiceType } from '../common/enums/services';
import { Branch } from '../entities/branch.entity';
import { City } from '../entities/city.entity';
import { Clients } from '../entities/clients.entity';
import { Purchase } from '../entities/purchase.entity';
import { User } from '../entities/user.entity';
import { AddBranchDto } from '../modules/client/dto/add-branch.dto';
import { BranchContractRequestDto } from '../modules/client/dto/branch-new-request.dto';
import { CreateClientDto } from '../modules/client/dto/create-client.dto';
import { CreateSimCardDto } from '../modules/client/dto/sim-card.dto';
import { CreateSimCardServiceDto } from '../modules/services/dto/sim-card-service.dto';
import { CreateServiceDto } from 'src/modules/services/dto/create-service.dto';
import { VM_SERVICE_TYPE } from 'src/common/enums/client';
import { Services } from 'src/entities/services.entity';
import { ServiceProduct } from 'src/entities/service-product.entity';

export interface ICreateService {
  createClientDto?: CreateClientDto;
  addBranch?: AddBranchDto;
  user: User;
  city: City;
  client: Clients;
  branch: Branch;
  purchase: Purchase;
  type: string;
  date: Date;
  queryRunner?: QueryRunner;
  newContract?: BranchContractRequestDto;
  installationDate? : Date,
  serviceDto? : CreateServiceDto,
  completedAt? : Date,
}

export interface IFemaleHygieneUnitServiceProduct {
  serviceProductId?: number;
  product?: {
    id: number;
    name: string;
  };
  productId?: number;
  quantity?: number;
  totalQuantity?: number;
  installedQuantity?: number;
  servicedQuantity?: number;
  serviceType?: string;
  serviceFrequency?: string;
  invoiceAmount?: number;
  isInvoiceSubmitted?: string;
  invoiceOther?: string;
  invoiceNumber?: number;
  fhuSignedReportCardFileId?: number[];
  fhuDeliveryChallanFileId?: number[];
  fhuAckInvoiceFileId?: number[];
  files?: any[];
}

export interface IVendingMachineServiceProduct {
  serviceProductId?: number;
  productId?: number;
  product?: {
    id: number;
    name: string;
  };
  quantity?: number;
  totalQuantity?: number;
  installedQuantity?: number;
  servicedQuantity?: number;
  deploymentType?: string;
  serviceType?: string;
  serviceFrequency?: string;
  machineNumber?: string;
  vmMaintenanceParts?: string;
  vmMaintenancePartOther?: string;
  vmMaintenancePartQty?: string;
  invoiceAmount?: number;
  padRefillingQuantity5Rs?: number;
  padRefillingQuantity10Rs?: number;
  coinRefillingCollection5Rs?: number;
  coinRefillingCollection10Rs?: number;
  padSoldQuantity5Rs?: number;
  padSoldQuantity10Rs?: number;
  padSoldInvAmount?: number;
  vmSalesOrder?: number[];
  vmAckInvoiceFileId?: number[];
  vmDeliveryChallanFileId?: number[];
  vmSignedReportCardFileId?: number[];
  vmRefillingQuantity?: number;
  vmRefillingAmount?: number;
  files?: any[];
}

export interface ISanitaryPadService {
  serviceProductId?: number;
  padBrand?: string;
  quantity?: number;
  totalQuantity?: number;
  installedQuantity?: number;
  padQuantity?: number;
  cost?: number;
  padCost?: number;
  totalCost?: number;
  padAckInvoiceFileId?: number[];
  padDeliveryChallanFileId?: number[];
  padSignedReportCardFileId?: number[];
  files?: any[];
}

export interface ISimDetailService {
  serviceProductId?: number;
  simBrand?: string;
  price?: number;
  simNumber?: number;
  simRechargePrice?: number;
  totalQuantity?: number;
  installedQuantity?: number;
}

export interface ISimCardServiceDTO {
  createService?: CreateSimCardDto[];
  updateService?: CreateSimCardServiceDto[];
}

export interface IServiceProductCondition {
  serviceId?: number;
  branchId?: number[];
  purchaseIds?: number[];
  type?: ServiceType;
  withoutGrouping?: boolean;
}

export interface IServiceProduct {
  femaleHygieneUnit: IFemaleHygieneUnitServiceProduct[];
  vendingMachine: IVendingMachineServiceProduct[];
  sim: ISimDetailService[];
  vendingMachinePads: ISanitaryPadService[];
  sanitaryPads: ISanitaryPadService[];
}

export interface IServiceAnalyticData {
  user: User;
  clientId?: number;
  cityId?: number;
  branchId?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IServiceAnalyticEvent {
  client: Clients;
  city: City;
  branch: Branch;
  serviceId: number;
  date: Date;
  status?: ServiceStatus;
}

export interface IGetServiceCountData {
  user: User;
  clientId?: number;
  branchId?: number;
  cityId: number;
  startDate: Date;
  endDate: Date;
}

export interface IServiceProductEntity {
  service : Services,
  serviceId : number,
  productId : number,
  branchProductId : number,
  totalQuantity: number
  installedQuantity: number
  serviceQuantity: number
  serviceType: VM_SERVICE_TYPE
  serviceFrequency: string
  invoiceAmount: number
  isInvoiceSubmitted: string
  invoiceOther: string
  invoiceNumber: string
  padRefillingQuantity5Rs: number
  padRefillingQuantity10Rs: number
  coinRefillingCollection5Rs: number
  coinRefillingCollection10Rs: number
  padSoldQuantity5Rs: number
  padSoldQuantity10Rs: number
  padSoldInvAmount: number
  simBrand: string
  simNumber: string
  simRechargePrice: number
  padBrand: string
  padQuantity: number
  padCost: number
  totalCost: number
  padType: string
  vmMachineNumber: string
  vmMaintenanceParts: string
  vmMaintenancePartOther: string
  vmMaintenancePartQty : number
  refillingQuantity: number
  refillingAmount: number
  actualCost: number
}

export interface IServiceEntity {
  id: number;
  clientId: number;
  branchId: number;
  cityId: number;
  purchase:Purchase;
  purchaseId: number;
  serviceProduct: ServiceProduct[];
  type: ServiceType;
  date: Date;
  status: ServiceStatus;
  actualServiceDate: Date;
  rating: number;
  totalServiceCost: number;
  wastePadCollection: string;
  clientOnboardingProduct: string;
  isInvoiceSubmitted: string;
  invoiceOther: string;
  vehicleUsed: string;
  otherVehicleDetail: string;
  binMaintenanceParts: string;
  
  binMaintenanceOtherPart: string;
  binMaintenancePartQty: number;
  invoiceAmount: number;
  stickers : string,
  completedAt: Date;
}
