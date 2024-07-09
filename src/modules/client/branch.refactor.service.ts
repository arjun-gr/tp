import { plainToClass } from 'class-transformer';
import { Branch } from 'src/entities/branch.entity';
import { IBranchEntity } from 'src/interfaces/branch';

export function createBranchEntity(data: Partial<IBranchEntity>) {
  const branch: Branch = plainToClass(Branch, {
    name: data.branchName,
    billingAddress: data.billingAddress,
    siteAddress: data.siteAddress,
    pincode: data.pincode,
    gstNumber: data.gstNumber,
    femaleCount: data.femaleCount,
    contractStartDate: data.contractStartDate,
    contractEndDate: data.contractEndDate,
    contractPeriod: data.contractPeriod,
    salesLead: data.salesLead,
    city: data.city || { id: data.cityId },
    client: data.client || { id: data.clientId },
    spocs: data.spocs || { id: data.spocsId },
    user: data.user || { id: data.userId },
    services: data.services || { id: data.servicesId },
    purchase: data.purchase || { id: data.purchaseId },
    // activePurchase: Purchase,
    branchProduct: data.branchProduct || { id: data.branchProductId },
    deactivatedAt: data.deactivatedAt,
    deactivateReason: data.deactivateReason,
    deactivatedBy: data.deactivatedBy || { id: data.deactivatedById },
    deletedReason: data.deletedReason,
    deletedBy: data.deletedBy || { id: data.deletedById },
  });
  return this.branchRepository.create(branch);
}
