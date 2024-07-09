import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as xlsx from 'node-xlsx';
import { Between, ILike, In, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import {
  INVOICE_FILE_LIST,
  SERVICE_CARD_FILE_LIST,
} from '../../common/enums/services';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { Services } from '../../entities/services.entity';
import { User } from '../../entities/user.entity';
import { formatDate } from '../../utils/app.utils';
import { getFirstAndLastDayOfMonth } from '../../utils/date.utils';
import { generatePdf } from '../../utils/file.utils';
import {
  PADCARE_FILES_REPOSITORY,
  SERVICE_REPOSITORY,
} from '../database/database.providers';
import { FileService } from '../file/file.service';
import { ServicesService } from '../services/services.service';
import { serviceInvoiceList } from './reports.helper';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(PADCARE_FILES_REPOSITORY)
    private padcareFileRepository: Repository<PadcareFiles>,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
    private service: ServicesService,
    private configService: ConfigService,
    private fileService: FileService,
  ) {}

  private createExcelSheet = (res, excelSheet, excelSheetOptions, type) => {
    const reportSheets = [
      { name: 'Report', data: excelSheet, options: excelSheetOptions },
    ];

    const buffer = xlsx.build(reportSheets);
    return this.downloadExcelResource(res, `${type}_report.xlsx`, buffer);
  };

  private downloadExcelResource = (res, fileName, data) => {
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.attachment(fileName);
    return res.send(data);
  };

  async getAllServiceCardsAndInvoices(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    month: Date,
    reportType: string,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let dateFilter = null,
      padcarefiles: any = null,
      files = null;
    if (month) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);
      dateFilter = Between(firstDay, lastDay);
    }
    let count: any = 0;
    if (reportType == 'service_card') files = SERVICE_CARD_FILE_LIST;
    if (reportType == 'invoice') files = INVOICE_FILE_LIST;
    const baseConditions = {
      isActive: true,
      client: { id: clientId },
      branch: { id: branchId },
      service: { date: dateFilter },
      city: { id: In(cityIds) },
      fileType: In(files),
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
          {
            ...baseConditions,
            service: { ...baseConditions.service, id: ILike(`${search}`) },
          },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v: any) {
        if (!cityIds?.length) delete v?.city;
        if (!dateFilter) delete v?.service?.date;
        if (!clientId) delete v?.client?.id;
        if (!branchId) delete v.branch;
      });
    } else {
      if (!cityIds?.length) delete where.city;
      if (!dateFilter) delete where.service;
      if (!clientId) delete where?.client;
      if (!branchId) delete where.branch;
    }
    [padcarefiles, count] = await this.padcareFileRepository.findAndCount({
      where,
      withDeleted: true,
      relations: {
        fileId: true,
        client: true,
        city: true,
        service: true,
        purchase: { branch: true },
        serviceProduct: true,
      },
      select: {
        fileId: {
          id: true,
          originalName: true,
          size: true,
          url: true,
          mimetype: true,
        },
        id: true,
        fileType: true,
        createdAt: true,
        client: {
          name: true,
        },
        city: {
          name: true,
        },
        service: {
          id: true,
          type: true,
          date: true,
        },
        purchase: {
          id: true,
          branch: {
            name: true,
          },
        },
        serviceProduct: {
          invoiceNumber: true,
          invoiceAmount: true,
          serviceFrequency: true,
          serviceType: true,
        },
      },
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto,
    });
    return new PageDto(padcarefiles, pageMetaDto);
  }

  async getRecycleCertificates(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    month: Date,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let dateFilter = null;
    if (month) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);
      dateFilter = Between(firstDay, lastDay);
    }
    const baseConditions = {
      isActive: true,
      date: dateFilter,
      city: { id: In(cityIds) },
      client: { id: clientId },
      branch: { id: branchId },
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
          {
            ...baseConditions,
            id: ILike(`${search}`),
          },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v: any) {
        if (!cityIds?.length) delete v?.city;
        if (!dateFilter) delete v.date;
        if (!clientId) delete v?.client?.id;
        if (!branchId) delete v?.purchase?.branch?.id;
      });
    } else {
      if (!cityIds?.length) delete where.city;
      if (!dateFilter) delete where.date;
      if (!clientId) delete where?.client;
      if (!branchId) delete where?.purchase;
    }
    let [list, count]: any = await this.serviceRepository.findAndCount({
      relations: {
        client: true,
        branch: true,
        purchase: {
          branchProduct: {
            product: true,
          },
        },
      },
      where: where,
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const services = await serviceInvoiceList(list);
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(services, pageMetaDto);
  }

  async getRecyclingCertificate(serviceId: number) {
    let certificateObj: any = {};
    const fs = require('fs');
    const { service }: any = await this.service.findOne(serviceId);
    const contractStartDate = service?.purchase?.contractStartDate;
    const contractEndDate = service?.purchase?.contractEndDate;
    const clientName = service?.client?.name;
    certificateObj.clientName = clientName;
    certificateObj.contractStartDate = formatDate(
      contractStartDate,
      'DD-MM-YYYY',
    );
    certificateObj.contractEndDate = formatDate(contractEndDate, 'DD-MM-YYYY');
    certificateObj.date = formatDate(new Date(), 'DD/MM/YYYY');
    certificateObj.logo = service?.client?.logo?.url
      ? this.fileService.getSignedUrl(service?.client?.logo?.url)
      : null;
    certificateObj.address = service?.branch?.billingAddress;
    const fileName = `${certificateObj.clientName}-${certificateObj.contractStartDate}-${certificateObj.contractEndDate}.pdf`;
    const path = require('path');
    const templateFilePath = path.join(
      process.cwd(),
      this.configService.get('RECYCLING_CERTIFICATE_PATH'),
    );
    await generatePdf(
      certificateObj,
      fileName,
      templateFilePath,
      this.configService.get('RECYCLING_CERTIFICATE_FOLDER'),
    );
    return fileName;
  }
}
