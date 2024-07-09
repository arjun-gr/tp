import { User } from '../entities/user.entity';

export interface IServiceProductDetails {
  noOfBins: number;
  noOfVendingMachines: number;
  buyoutProduct: number;
  buyoutPads: number;
}

export interface IpadAnalyticsData {
  wastePadCollectionInGrams: number;
  totalMaterialProceedInKg: number;
  landfillAreaSaved: number;
  carbonSaved: number;
  padsCollected: number;
  totalPadProceed?: 0;
}

export interface IAnalyticDataReq {
  user: User;
  clientId?: number;
  branchId?: number;
  cityId: number;
  startDate: Date;
  endDate: Date;
}
export interface IGetImpactReportReq {
  clientId: number;
  branchId: number;
  cityIds?: number[];
  startDate: Date;
  endDate: Date;
}
