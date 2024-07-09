import { plainToClass } from 'class-transformer';
import { BranchProduct } from 'src/entities/branch-products.entity';
import { IBranchProductsEntity } from 'src/interfaces/branchProducts';

export function createBranchProductsEntity(
  data: Partial<IBranchProductsEntity>,
) {
  const branchProduct: BranchProduct = plainToClass(BranchProduct, {
    purchase: data.purchase || { id: data.purchaseId },
    product: data.product || { id: data.productId },
    branch: data.branch || { id: data.branchId },
    quantity: data.quantity,
    serviceType: data.serviceType,
    deploymentType: data.deploymentType,
    serviceCost: data.serviceCost,
    rentalAmount: data.rentalAmount,
    buyoutAmount: data.buyoutAmount,
    refillingQuantity: data.refillingQuantity,
    refillingAmount: data.refillingAmount,
    status: data.status,
    totalCost: data.totalCost,
    simCardBrand: data.simCardBrand,
    simCardRechargePrice: data.simCardRechargePrice,
    sanitaryPadBrand: data.sanitaryPadBrand,
    padQuantity: data.padQuantity,
    padCost: data.padCost,
    padType: data.padType,
    simNumber: data.simNumber,
  });

  return branchProduct;
}
