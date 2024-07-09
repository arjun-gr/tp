import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In, LessThan, Repository } from 'typeorm';
import { Analytics } from '../../entities/analytics.entity';
import { Branch } from '../../entities/branch.entity';
import { getLastMonthFirstAndLastDay } from '../../utils/date.utils';
import { BranchProductService } from '../client/branch-product.service';
import { PurchaseService } from '../client/purchase.service';
import {
  ANALYTICS_REPOSITORY,
  BRANCH_REPOSITORY,
} from '../database/database.providers';
import { ReportsService } from '../reports/reports.service';
import { ServicesService } from '../services/services.service';
import { ServiceCron } from './services-cron.service';
import { TicketCron } from './ticket-cron.service';

@Injectable()
export class TasksService {
  constructor(
    private reportService: ReportsService,
    private purchaseService: PurchaseService,
    private branchProductService: BranchProductService,
    private service: ServicesService,
    private ticketCron: TicketCron,
    private serviceCron: ServiceCron,
    @Inject(ANALYTICS_REPOSITORY)
    private analyticsRepository: Repository<Analytics>,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deactivateContracts() {
    const purchases: any = await this.purchaseService.getPurchaseByPurchaseId({
      where: {
        isActive: true,
        contractEndDate: LessThan(new Date()),
      },
      findOne: false,
    });
    if (!purchases?.length) return;
    const purchaseIds = purchases?.map((i: any) => i?.id);
    await this.service.deactivateContractServicesByPurchaseId(purchaseIds);
    await this.branchProductService.deactivateBranchProductsByPurchase(
      purchaseIds,
    );
    await this.purchaseService.deactivatePurchaseById(
      purchaseIds,
      false,
      null,
      'deactivated by system',
    );
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async saveAnalyticData() {
    const service = await this.serviceCron.getServiceLastMonthData();
    const ticket = await this.ticketCron.getTicketLastMonthCount();
    const data = this.mergeObjects(ticket, service);
    const { lastDay } = getLastMonthFirstAndLastDay();
    const result = await this.createAnalyticsData(data, lastDay);
    await this.analyticsRepository.insert(result);
  }

  mergeObjects(obj1: any, obj2: any) {
    const merged = { ...obj1 };

    for (const key in obj2) {
      if (merged[key]) {
        Object.assign(merged[key], obj2[key]);
      } else {
        merged[key] = obj2[key];
      }
    }

    return merged;
  }

  async createAnalyticsData(analytics: any, lastDayMonth) {
    const analyticsData = [];
    const branchIds = Object.keys(analytics).map((key) => parseInt(key));
    const ids = await this.getBranchCityByBranchId(branchIds);
    for (const branch of branchIds) {
      const branchDetails = analytics[branch];
      let branchData = ids.find((i: any) => i.id == branch);
      const analytic = this.analyticsRepository.create({
        branch: {
          id: branchDetails?.branchId,
        },
        client: {
          id: branchDetails?.clientId,
        },
        city: {
          id: branchData.city.id,
        },
        date: lastDayMonth,
        pads_collected: branchDetails?.padCollected || 0,
        material_processed_kg: branchDetails?.totalMaterialProceedInKg || 0,
        landfill_area_saved_liters: branchDetails?.landfillSaved || 0,
        carbon_equivalents_conserved_kg: branchDetails?.carbonSaved || 0,
        total_complaints: branchDetails?.totalComplaints || 0,
        resolved_complaints: branchDetails?.resolvedComplaints || 0,
        pending_complaints: branchDetails?.pendingComplaints || 0,
        complaintsTatTime: branchDetails?.complaintTatTime || 0,
        total_services: branchDetails?.total || 0,
        completed_services: branchDetails?.completed || 0,
        pending_services: branchDetails?.pending || 0,
        noOfBins: branchDetails?.noOfBins || 0,
        buyoutProduct: branchDetails?.buyoutProduct || 0,
      });
      analyticsData.push(analytic);
    }
    return analyticsData;
  }

  async getBranchCityByBranchId(branchId: number[]) {
    return this.branchRepository.find({
      where: {
        id: In(branchId),
      },
      relations: {
        city: true,
      },
      select: {
        id: true,
        name: true,
        city: {
          id: true,
          name: true,
        },
      },
    });
  }
}
