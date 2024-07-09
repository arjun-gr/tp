import { BranchProduct } from 'src/entities/branch-products.entity';
import { City } from 'src/entities/city.entity';
import { Clients } from 'src/entities/clients.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { Services } from 'src/entities/services.entity';
import { SPOCS } from 'src/entities/spoc.entity';
import { User } from 'src/entities/user.entity';

export interface IBranchEntity {
  branchName: string;
  billingAddress: string;
  siteAddress: string;
  pincode: number;
  gstNumber: string;
  femaleCount: number;
  contractStartDate: Date;
  contractEndDate: Date;
  contractPeriod: number;
  salesLead: string;
  city: City;
  cityId: number;
  client: Clients;
  clientId: number;
  spocs: SPOCS;
  spocsId: number;
  user: User;
  userId: number;
  services: Services;
  servicesId: number;
  purchase: Purchase;
  purchaseId: number;
  // activePurchase: Purchase,
  branchProduct: BranchProduct;
  branchProductId: number;
  deactivatedAt: Date;
  deactivateReason: string;
  deactivatedBy: User;
  deactivatedById: number;
  deletedReason: string;
  deletedBy: User;
  deletedById: number;
}
