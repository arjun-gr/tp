import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import * as path from 'path';
import { Between, ILike, In, Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PAD_ORDER_TYPE, VM_SERVICE_TYPE } from '../../common/enums/client';
import { ServiceStatus } from '../../common/enums/services';
import { TicketStatus } from '../../common/enums/ticket-status';
import { Analytics } from '../../entities/analytics.entity';
import { ServiceProduct } from '../../entities/service-product.entity';
import { Services } from '../../entities/services.entity';
import { Ticket } from '../../entities/ticket.entity';
import { User } from '../../entities/user.entity';
import {
  IAnalyticDataReq,
  IGetImpactReportReq,
  IpadAnalyticsData,
} from '../../interfaces/analytics';
import {
  IFemaleHygieneUnitServiceProduct,
  IGetServiceCountData,
  ISanitaryPadService,
  IServiceAnalyticEvent,
  ISimDetailService,
  IVendingMachineServiceProduct,
} from '../../interfaces/service';
import { convertToNumberAndCheckNaN, formatDate } from '../../utils/app.utils';
import { generatePdf } from '../../utils/file.utils';
import {
  ANALYTICS_REPOSITORY,
  SERVICE_PRODUCT_REPOSITORY,
  SERVICE_REPOSITORY,
  TICKET_REPOSITORY,
} from '../database/database.providers';
import { ProductService } from '../product/product.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private analyticsRepository: Repository<Analytics>,
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: Repository<Ticket>,
    private configService: ConfigService,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
    @Inject(SERVICE_PRODUCT_REPOSITORY)
    private serviceProductRepository: Repository<ServiceProduct>,
    @Inject(ProductService)
    private productService: ProductService,
  ) {}

  async getImpactReport(req: IGetImpactReportReq) {
    const { clientId, branchId, startDate, endDate } = req;
    const data = await this.getReportData({
      clientId,
      startDate,
      endDate,
      branchId,
    });

    if (!data || data.length <= 0) {
      throw new BadRequestException('Data not exists');
    }
    if (!data[0].clientName) {
      throw new BadRequestException('Data not exists');
    }
    let reportObj: any = {};
    const startMonth = formatDate(startDate, 'MMM');
    const endMonth = formatDate(endDate, 'MMM');
    const year = formatDate(endDate, 'YYYY');

    if (data && data.length) {
      const obj = data[0];
      reportObj = {
        clientName: obj.clientName,
        branchName: obj.branchName || '',
        pads_collected: obj.pads_collected,
        material_processed_kg: obj.material_processed_kg,
        landfill_area_saved_liters: obj.landfill_area_saved_liters,
        carbon_equivalents_conserved_kg: obj.carbon_equivalents_conserved_kg,
        startMonth,
        endMonth: startMonth == endMonth ? '' : endMonth,
        year,
      };
    }
    const fileName = `${reportObj.clientName}-${
      reportObj.branchName
    }-${startMonth}${startMonth == endMonth ? '' : '-' + endMonth}-${year}.pdf`;
    const templateFilePath = path.join(
      process.cwd(),
      this.configService.get('IMPACT_REPORT_TEMPLATE_PATH'),
    );
    await generatePdf(
      reportObj,
      fileName,
      templateFilePath,
      this.configService.get('REPORT_FOLDER'),
    );

    return fileName;
  }

  async getReportData(req: IGetImpactReportReq) {
    const { clientId, branchId, startDate, endDate, cityIds } = req;
    let query = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .leftJoin('analytics.client', 'client')
      .select('SUM(pads_collected)', 'pads_collected')
      .addSelect('SUM(material_processed_kg)', 'material_processed_kg')
      .addSelect(
        'SUM(landfill_area_saved_liters)',
        'landfill_area_saved_liters',
      )
      .addSelect(
        'SUM(carbon_equivalents_conserved_kg)',
        'carbon_equivalents_conserved_kg',
      )
      .where(`date BETWEEN '${startDate}' AND '${endDate}'`);

    if (clientId) {
      query.where('client = :clientId', { clientId });
      query.addSelect('client.name', 'clientName');
    }
    if (branchId) {
      query.leftJoin('analytics.branch', 'branch');
      query.addSelect('branch.name', 'branchName');
      query.andWhere('branch = :branchId', { branchId });
    }
    if (cityIds && cityIds?.length) {
      query.andWhere('city IN (:...cityIds)', { cityIds });
    }

    return await query.execute();
  }

  async getAllImpactReports(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    const firstDay = startDate;
    const lastDay = endDate;
    const baseConditions = {
      isActive: true,
      client: { id: clientId },
      branch: { id: branchId, city: { id: In(cityIds) } },
      date: Between(firstDay, lastDay),
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
          {
            ...baseConditions,
            branch: { ...baseConditions.branch, name: ILike(`%${search}%`) },
          },
          // {
          //   ...baseConditions,
          //   branch: {
          //     ...baseConditions.branch,
          //     users: { name: ILike(`%${search}%`) },
          //   },
          // },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v: any) {
        if (!cityIds?.length) delete v?.branch.city;
        if (!clientId) delete v.client.id;
        if (!branchId) delete v.branch.id;
        if (!firstDay || !lastDay) delete v.date;
      });
    } else {
      if (!cityIds?.length) delete where.branch.city.id;
      if (!firstDay || !lastDay) delete where.date;
      if (!clientId) delete where.client;
      if (!cityIds?.length) delete where?.branch.city;
      if (!branchId) delete where.branch.id;
    }
    const [list, count] = await this.analyticsRepository.findAndCount({
      relations: {
        client: true,
        branch: {
          city: {
            users: true,
          },
        },
      },
      select: {
        id: true,
        date: true,
        createdAt: true,
        client: {
          id: true,
          name: true,
        },
        branch: {
          id: true,
          name: true,
          city: {
            id: true,
            name: true,
            users: {
              name: true,
            },
          },
        },
      },
      where: where,
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  @OnEvent(Events.SERVICE_ANALYTIC_DATA_ADDED)
  async analyticDataAdded(event: { data: IServiceAnalyticEvent }) {
    const {
      data: { client, branch, date, city, serviceId },
    } = event;
    const analytic = await this.analyticsRepository.findOne({
      where: {
        client: { id: client.id },
        branch: { id: branch.id },
        city: { id: city.id },
        date: date,
      },
    });
    const serviceDetails = await this.getServiceProductsByServiceId(serviceId);
    const serviceData = await this.serviceDataCalculations(serviceDetails);
    if (analytic) {
      const padsCollected = convertToNumberAndCheckNaN(analytic.pads_collected);
      const materialProcessedKg = convertToNumberAndCheckNaN(
        analytic.material_processed_kg,
      );
      const landfillAreaSavedLiters = convertToNumberAndCheckNaN(
        analytic.landfill_area_saved_liters,
      );
      const carbonSaved = convertToNumberAndCheckNaN(
        analytic.carbon_equivalents_conserved_kg,
      );
      const noOfBins = convertToNumberAndCheckNaN(analytic.noOfBins);
      const buyoutProduct = convertToNumberAndCheckNaN(analytic.buyoutProduct);
      const updateAnalyticData = this.analyticsRepository.create({
        pads_collected: padsCollected + serviceData.padsCollected,
        material_processed_kg:
          materialProcessedKg + serviceData.totalMaterialProceedInKg,
        landfill_area_saved_liters:
          landfillAreaSavedLiters + serviceData.landfillAreaSaved,
        carbon_equivalents_conserved_kg: carbonSaved + serviceData.carbonSaved,
        noOfBins: noOfBins + serviceData.noOfBins,
        buyoutProduct: buyoutProduct + serviceData.buyOutVendingMachines,
      });
      this.analyticsRepository.update({ id: analytic.id }, updateAnalyticData);
    } else {
      const saveAnalyticData = this.analyticsRepository.create({
        client,
        branch,
        city,
        date,
        pads_collected: serviceData.padsCollected,
        material_processed_kg: serviceData.totalMaterialProceedInKg,
        landfill_area_saved_liters: serviceData.landfillAreaSaved,
        carbon_equivalents_conserved_kg: serviceData.carbonSaved,
        noOfBins: serviceData.noOfBins,
        buyoutProduct: serviceData.buyOutVendingMachines,
      });
      this.analyticsRepository.insert(saveAnalyticData);
    }
  }

  padServiceCalculation(
    wastePadCollectionInGrams: any,
    data: IpadAnalyticsData,
  ) {
    if (!wastePadCollectionInGrams) return data;
    let materialProcessedInKg = this.totalMaterialProceedInKg(
      wastePadCollectionInGrams,
    );
    let padsCollected = this.padCollectedCalc(wastePadCollectionInGrams);
    let landfillAreaSaved = this.landfillSaved(padsCollected);
    let carbonSaved = this.carbonSaved(materialProcessedInKg);
    data.wastePadCollectionInGrams = wastePadCollectionInGrams;
    data.totalMaterialProceedInKg += materialProcessedInKg;
    data.landfillAreaSaved += landfillAreaSaved;
    data.carbonSaved += carbonSaved;
    data.padsCollected += padsCollected;
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
    data.padsCollected += coinCollected5rs + coinCollected10rs;
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

  async getServiceProductsByServiceId(serviceId: number) {
    const serviceProduct: any = await this.serviceProductRepository.find({
      where: { service: { id: serviceId }, isActive: true },
      relations: {
        product: true,
        service: {
          user: true,
          client: true,
          branch: true,
          city: true,
          purchase: true,
        },
      },
      select: {
        service: {
          id: true,
          wastePadCollection: true,
          status: true,
          user: { id: true },
          client: { id: true },
          branch: { id: true },
          city: { id: true },
          purchase: { id: true },
        },
        product: { id: true, name: true },
      },
    });
    let data = await this.getServiceProduct(serviceProduct);
    return { ...serviceProduct[0], ...data };
  }

  async getServiceProduct(serviceProduct: any) {
    const response = {
      femaleHygieneUnit: [],
      vendingMachine: [],
      sim: [],
      vendingMachinePads: [],
      sanitaryPads: [],
    };

    const femaleHygieneUnit = await this.productService.getProducts(
      'female_hygiene_unit',
    );
    const vendingMachine =
      await this.productService.getProducts('vending_machine');
    let femaleHygieneUnitIds = femaleHygieneUnit?.map((fhu: any) => fhu.id);
    let vendingMachineIds = vendingMachine?.map((vm: any) => vm.id);
    for (const data of serviceProduct) {
      if (vendingMachineIds?.includes(data?.product?.id)) {
        let vm: IVendingMachineServiceProduct = {};
        vm.serviceProductId = data.id;
        vm.product = {
          id: data?.product?.id,
          name: data?.product.name,
        };
        vm.totalQuantity = data?.totalQuantity;
        vm.installedQuantity = data?.installedQuantity;
        vm.servicedQuantity = data?.serviceQuantity;
        vm.serviceType = data?.serviceType;
        vm.serviceFrequency = data?.serviceFrequency;
        vm.machineNumber = data?.vmMachineNumber;
        vm.invoiceAmount = data?.invoiceAmount;
        vm.padRefillingQuantity5Rs = data.padRefillingQuantity5Rs;
        vm.padRefillingQuantity10Rs = data.padRefillingQuantity10Rs;
        vm.coinRefillingCollection5Rs = data.coinRefillingCollection5Rs;
        vm.coinRefillingCollection10Rs = data.coinRefillingCollection10Rs;
        vm.padSoldQuantity5Rs = data.padSoldQuantity5Rs;
        vm.padSoldQuantity10Rs = data.padSoldQuantity10Rs;
        vm.padSoldInvAmount = data.padSoldInvAmount;
        vm.vmMaintenanceParts = data.vmMaintenanceParts;
        vm.vmMaintenancePartOther = data.vmMaintenancePartOther;
        vm.vmMaintenancePartQty = data.vmMaintenancePartQty;
        response.vendingMachine.push(vm);
      }
      if (femaleHygieneUnitIds?.includes(data?.product?.id)) {
        let fhu: IFemaleHygieneUnitServiceProduct = {};
        fhu.serviceProductId = data.id;
        fhu.product = {
          id: data?.product?.id,
          name: data?.product.name,
        };
        fhu.totalQuantity = data?.totalQuantity;
        fhu.installedQuantity = data?.installedQuantity;
        fhu.servicedQuantity = data?.serviceQuantity;
        fhu.serviceType = data?.serviceType;
        fhu.serviceFrequency = data?.serviceFrequency;
        fhu.invoiceAmount = data?.invoiceAmount;
        fhu.invoiceOther = data?.invoiceOther;
        fhu.isInvoiceSubmitted = data.isInvoiceSubmitted;
        fhu.invoiceNumber = data.invoiceNumber;
        response.femaleHygieneUnit.push(fhu);
      }
      if (data.simBrand || data.simNumber || data.simRechargePrice) {
        let simCard: ISimDetailService = {};
        simCard.serviceProductId = data.id;
        simCard.simBrand = data.simBrand;
        simCard.simNumber = data.simNumber;
        simCard.simRechargePrice = data.simRechargePrice;
        response.sim.push(simCard);
      }

      let sanitaryPads: ISanitaryPadService = {};
      if (data.padType == PAD_ORDER_TYPE.SANITARY_PAD) {
        sanitaryPads.serviceProductId = data.id;
        sanitaryPads.padBrand = data.padBrand;
        sanitaryPads.padQuantity = data.padQuantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        response.sanitaryPads.push(sanitaryPads);
      }
      if (data.padType == PAD_ORDER_TYPE.VENDING_MACHINE_PAD) {
        sanitaryPads.serviceProductId = data.id;
        sanitaryPads.padBrand = data.padBrand;
        sanitaryPads.padQuantity = data.padQuantity;
        sanitaryPads.padCost = data.padCost;
        sanitaryPads.totalCost = data.totalCost;
        response.vendingMachinePads.push(sanitaryPads);
      }
    }
    return response;
  }

  async serviceDataCalculations(data: any) {
    let serviceDataCalc: any = {};
    const padCalc: IpadAnalyticsData = {
      wastePadCollectionInGrams: 0,
      totalMaterialProceedInKg: 0,
      landfillAreaSaved: 0,
      carbonSaved: 0,
      padsCollected: 0,
    };
    const wastePadCollectionInGrams = data?.service?.wastePadCollection;
    if (wastePadCollectionInGrams) {
      const wastePadCollection = this.padServiceCalculation(
        wastePadCollectionInGrams,
        padCalc,
      );
      const padCollection = this.padCollected(data, padCalc);
      serviceDataCalc = { ...wastePadCollection, ...padCollection };
    }
    const noOfBins = data?.femaleHygieneUnit?.length || 0;
    const noOfVendingMachines = data?.vendingMachine?.length || 0;
    const buyOutVendingMachines =
      data?.vendingMachine?.filter(
        (val: any) => val.deploymentType === VM_SERVICE_TYPE.BUYOUT,
      )?.length || 0;
    const rentalVendingMachines =
      data?.vendingMachine?.filter(
        (val: any) => val.deploymentType === VM_SERVICE_TYPE.RENTAL,
      )?.length || 0;
    const buyoutPads = data?.sanitaryPads?.length || 0;
    return {
      ...serviceDataCalc,
      noOfBins,
      noOfVendingMachines,
      buyOutVendingMachines,
      rentalVendingMachines,
      buyoutPads,
    };
  }

  async getTicketAnalyticData(data: IGetServiceCountData) {
    const { user, startDate, endDate, cityId, clientId, branchId } = data;
    const client = user['clientId'] || clientId || null;
    const branch = user['branchId'] || branchId || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let dateFilter = Between(startDate, endDate);
    const baseConditions = {
      isActive: true,
      city: { id: In(cityIds) },
      client: { id: client },
      branch: { id: branch },
      date: dateFilter,
    };
    if (!client) delete baseConditions.client;
    if (!branch) delete baseConditions.branch;
    if (!cityIds?.length) delete baseConditions.city;
    if (!startDate && !endDate) delete baseConditions.date;

    const ticket: any = await this.ticketRepository.find({
      where: baseConditions,
      select: { id: true, ticketStatus: true },
    });

    const total = ticket?.length || 0;
    const pending =
      ticket?.filter(
        (i: any) =>
          [TicketStatus.PLANNED].includes(i?.ticketStatus) &&
          new Date(i.date) < new Date(),
      )?.length || 0;
    const resolved =
      ticket?.filter((i: any) => i.ticketStatus == TicketStatus.COMPLETED)
        ?.length || 0;
    return {
      total,
      resolved,
      pending,
    };
  }

  async getServiceAnalyticData(data: IGetServiceCountData) {
    const { user, startDate, endDate, cityId, clientId, branchId } = data;
    const client = user['clientId'] || clientId || null;
    const branch = user['branchId'] || branchId || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let dateFilter = Between(startDate, endDate);
    const baseConditions = {
      isActive: true,
      city: { id: In(cityIds) },
      client: { id: client },
      branch: { id: branch },
      date: dateFilter,
    };

    if (!client) delete baseConditions.client;
    if (!branch) delete baseConditions.branch;
    if (!cityIds?.length) delete baseConditions.city;
    if (!startDate && !endDate) delete baseConditions.date;

    const services: any = await this.serviceRepository.find({
      relations: {
        client: true,
        city: true,
        branch: true,
      },
      select: {
        client: { id: true, name: true },
        city: { id: true, name: true },
        branch: { id: true, name: true },
        id: true,
        status: true,
        serviceAt: true,
        date: true,
        completedAt: true,
        cancelledAt: true,
      },
      where: baseConditions,
    });
    const total = services?.length || 0;
    const completed =
      services?.filter(
        (val: any) => val.status == ServiceStatus.COMPLETED && val.completedAt,
      )?.length || 0;
    const pending =
      services?.filter(
        (val: any) =>
          val.status == ServiceStatus.PLANNED &&
          new Date(val.serviceAt) < new Date(),
      ).length || 0;
    return {
      total,
      completed,
      pending,
    };
  }

  async getDashboardAnalyticData(data: IAnalyticDataReq) {
    const { user, startDate, endDate, cityId, clientId, branchId } = data;
    const client = user['clientId'] || clientId || null;
    const branch = user['branchId'] || branchId || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    // let dateFilter = Between(startDate, endDate);
    const [serviceAnalytic, service, ticket] = await Promise.all([
      this.getReportData({
        clientId: client,
        branchId: branch,
        startDate,
        endDate,
        cityIds,
      }),
      this.getServiceAnalyticData({
        user,
        startDate,
        endDate,
        cityId,
        clientId,
        branchId,
      }),
      this.getTicketAnalyticData({
        user,
        startDate,
        endDate,
        cityId,
        clientId,
        branchId,
      }),
    ]);
    return {
      serviceAnalytic,
      service,
      ticket,
    };
  }
}
