import { Inject, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { ANALYTICS_STATUS } from '../../common/enums/analytics';
import { PAD_ORDER_TYPE } from '../../common/enums/client';
import { ServiceStatus } from '../../common/enums/services';
import { Analytics } from '../../entities/analytics.entity';
import { BranchProduct } from '../../entities/branch-products.entity';
import { Services } from '../../entities/services.entity';
import {
  IServiceProductDetails,
  IpadAnalyticsData,
} from '../../interfaces/analytics';
import { groupBy } from '../../utils/app.utils';
import { getLastMonthFirstAndLastDay } from '../../utils/date.utils';
import {
  ANALYTICS_REPOSITORY,
  BRANCH_PRODUCT_REPOSITORY,
  SERVICE_REPOSITORY,
} from '../database/database.providers';

@Injectable()
export class ServiceCron {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private analyticsRepository: Repository<Analytics>,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
    @Inject(BRANCH_PRODUCT_REPOSITORY)
    private branchProductsRepository: Repository<BranchProduct>,
  ) {}

  async getServiceCount(date: Date) {
    let services = {};
    const data = await this.serviceRepository
      .createQueryBuilder('service')
      .where('service.created_at >= :start AND service.created_at < :end', {
        start: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
        ),
        end: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
        ),
      })
      .select('service.*')
      .execute();
    const returnData = groupBy(data, (row: any) => row.branch_id);
    for (const key in returnData) {
      if (Object.hasOwnProperty.call(returnData, key)) {
        const array = returnData[key];
        const statusCounts = this.groupAndCountServiceByBranch(array);
        const data = await this.getBinsAndBuyoutServiceProduct(Number(key));
        if (!services[key]) services[key] = {};
        services[key] = { ...data, ...statusCounts };
      }
    }
    await this.updateServiceAnalyticData(services, date, data.length);
    return services;
  }

  groupAndCountServiceByBranch(array: any) {
    let statusCounts: any = {};
    const padCalc: IpadAnalyticsData = {
      wastePadCollectionInGrams: 0,
      totalMaterialProceedInKg: 0,
      totalPadProceed: 0,
      landfillAreaSaved: 0,
      carbonSaved: 0,
      padsCollected: 0,
    };
    array.forEach((item: any) => {
      let status = item.status;
      const wastePadCollectionInGrams = item?.waste_pad_collection;
      const wastePadCollection = this.padServiceCalculation(
        wastePadCollectionInGrams,
        padCalc,
      );
      const padCollection = this.padCollected(item, padCalc);
      statusCounts = { ...wastePadCollection, ...padCollection };
      if (status == ServiceStatus.PLANNED || status == ServiceStatus.ONGOING)
        status = ANALYTICS_STATUS.PENDING;
      if (status == ServiceStatus.COMPLETED)
        status = ANALYTICS_STATUS.COMPLETED;

      statusCounts[status]
        ? statusCounts[status]++
        : (statusCounts[status] = 1);
    });
    const allTickets = array.filter((item: any) =>
      [
        ServiceStatus.ONGOING,
        ServiceStatus.COMPLETED,
        ServiceStatus.PLANNED,
        ServiceStatus.CANCELLED,
      ].includes(item.status),
    )?.length;
    return {
      ...statusCounts,
      total: allTickets || 0,
    };
  }

  async getBinsAndBuyoutServiceProduct(branchId: number) {
    let branchProduct = await this.branchProductsRepository.find({
      relations: {
        product: true,
      },
      where: {
        branch: { id: branchId, isActive: true },
      },
    });
    const groupData = groupBy(branchProduct, (row: any) => row?.product?.type);
    const buyoutProduct =
      groupData?.vending_machine?.filter(
        (val: any) => val.deploymentType === 'Buyout',
      )?.length || 0;
    const totalBins = groupData?.female_hygiene_unit?.length || 0;
    return {
      noOfBins: totalBins,
      buyoutProduct,
    };
  }

  async updateServiceAnalyticData(
    services: any,
    date: Date,
    totalServices: any,
  ) {
    if (!services) return {};
    for (const key in services) {
      if (Object.prototype.hasOwnProperty.call(services, key)) {
        const element = services[key];
        const analytic = await this.analyticsRepository
          .createQueryBuilder('analytic')
          .where('analytic.date >= :start AND analytic.date < :end', {
            start: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              0,
              0,
              0,
            ),
            end: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              23,
              59,
              59,
            ),
          })
          .andWhere('analytic.branch.id = :id', { id: Number(key) })
          .getOne();

        if (analytic) {
          await this.analyticsRepository.update(analytic.id, {
            pads_collected: element?.padCollected,
            noOfBins: element?.noOfBins,
            buyoutProduct: element?.buyoutProduct,
            material_processed_kg: element?.totalMaterialProceedInKg,
            landfill_area_saved_liters: element?.landfillSaved,
            carbon_equivalents_conserved_kg: element?.carbonSaved,
            total_services: element?.total || 0,
            completed_services: element?.completed,
            pending_services: element?.pending,
            noOfMonthlyServices: totalServices,
          });
        }
      }
    }
  }

  padServiceCalculation(
    actualWastePadCollection: any,
    data: IpadAnalyticsData,
  ) {
    if (!actualWastePadCollection) return data;
    let totalMaterialProceedInKg = this.totalMaterialProceedInKg(
      actualWastePadCollection,
    );
    let totalPadProceed = this.totalPadProceed(totalMaterialProceedInKg);
    let landfillAreaSaved = this.landfillSaved(totalPadProceed);
    let carbonSaved = this.carbonSaved(totalMaterialProceedInKg);
    data.totalMaterialProceedInKg += totalMaterialProceedInKg;
    data.totalPadProceed += totalPadProceed;
    data.landfillAreaSaved += landfillAreaSaved;
    data.carbonSaved = carbonSaved;
    return data;
  }

  /**
   * Query : which pad 5rs, 10rs
   * @param service
   * @param data
   * @returns
   */
  padCollected(service: any, data: any) {
    let coinCollected5rs = service['5_rs_coin_coll_quantity'] || 0;
    let coinCollected10rs = service['10_rs_coin_coll_quantity'] || 0;
    data.padCollected += coinCollected5rs + coinCollected10rs;
    return data;
  }

  /**
   * @description if pad collection is 2000(grams) then it converted into kg by dividing 1000;
   * @param actualWastePadCollection
   * @returns
   */
  totalMaterialProceedInKg(actualWastePadCollection: number) {
    return actualWastePadCollection / 1000;
  }

  totalPadProceed(totalMaterialProceedInKg: number) {
    return (totalMaterialProceedInKg * 1000) / 25;
  }

  padCollectedCalc(wightOfPadCollectionInGrams: number) {
    return wightOfPadCollectionInGrams / 25;
  }

  landfillSaved(padCollected: number) {
    return padCollected * 0.5;
  }

  carbonSaved(totalMaterialProceedInKg: number) {
    return totalMaterialProceedInKg * 2.14;
  }

  // calculate service data on monthly basic
  async getServiceLastMonthData() {
    const { firstDay, lastDay } = getLastMonthFirstAndLastDay();
    const serviceData = await this.serviceRepository.find({
      where: {
        createdAt: Between(firstDay, lastDay),
        status: ServiceStatus.COMPLETED,
        // serviceDate: Between(firstDay, lastDay),
      },
      relations: {
        client: true,
        branch: true,
        city: true,
        user: true,
        purchase: true,
      },
      select: {
        branch: {
          id: true,
        },
        client: {
          id: true,
        },
        city: {
          id: true,
        },
        user: {
          id: true,
        },
        purchase: {
          id: true,
        },
      },
    });
    let services = {};
    const groupByBranch = groupBy(serviceData, (row: any) => row.branch.id);
    for (const branch in groupByBranch) {
      if (Object.hasOwnProperty.call(groupByBranch, branch)) {
        const branchArray = groupByBranch[branch];
        const branchDetails = this.collectBranchBasicDetails(branchArray);
        const statusCounts = this.groupAndCountServiceByBranch(branchArray);
        const data = await this.getServiceProductsDetails(Number(branch));
        if (!services[branch]) services[branch] = {};
        services[branch] = { ...data, ...statusCounts, ...branchDetails };
      }
    }
    return services;
  }

  async getServiceProductsDetails(
    branchId: number,
  ): Promise<IServiceProductDetails> {
    if (!branchId) return {} as IServiceProductDetails;
    let branchProduct = await this.branchProductsRepository.find({
      relations: {
        product: true,
      },
      where: {
        branch: { id: branchId, isActive: true },
      },
    });
    const groupData = groupBy(
      branchProduct,
      (row: any) => row?.product?.type || row?.padType,
    );

    const buyoutProduct =
      groupData?.vending_machine?.filter(
        (val: any) => val.deploymentType === 'Buyout',
      )?.length || 0;
    const totalBins = groupData?.female_hygiene_unit?.length || 0;
    const totalVendingMachines = groupData?.vending_machine?.length || 0;
    const buyoutPads = groupData[PAD_ORDER_TYPE.SANITARY_PAD]?.length || 0;
    return {
      noOfBins: totalBins,
      noOfVendingMachines: totalVendingMachines,
      buyoutProduct,
      buyoutPads,
    };
  }

  collectBranchBasicDetails(branchArray: any[]) {
    const branch = branchArray[0];
    return {
      clientId: branch.client.id,
      branchId: branch.branch.id,
      cityId: branch.city.id,
    };
  }
}
