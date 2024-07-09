import { VM_SERVICE_TYPE } from "src/common/enums/client";
import { Branch } from "src/entities/branch.entity";
import { Products } from "src/entities/product.entity";
import { Purchase } from "src/entities/purchase.entity";

export interface IBranchProductsEntity{
    purchase: Purchase,
    purchaseId: number,
    product: Products,
    productId: number,
    branch: Branch,
    branchId: number,
    quantity: number,
    serviceType: string,
    deploymentType: VM_SERVICE_TYPE,
    serviceCost: number,
    rentalAmount: number,
    buyoutAmount: number,
    refillingQuantity: number,
    refillingAmount: number,
    status: string,
    totalCost: number,
    simCardBrand: string,
    simCardRechargePrice: number,
    sanitaryPadBrand: string,
    padQuantity: number,
    padCost: number,
    padType: string,
    simNumber: string,
}