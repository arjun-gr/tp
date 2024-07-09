import { Inject, Injectable } from '@nestjs/common';
import { Between, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { ClientFiles } from '../../common/enums/client';
import { Branch } from '../../entities/branch.entity';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { User } from '../../entities/user.entity';
import { getFirstAndLastDayOfMonth } from '../../utils/date.utils';
import {
  BRANCH_REPOSITORY,
  PADCARE_FILES_REPOSITORY,
} from '../database/database.providers';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    @Inject(PADCARE_FILES_REPOSITORY)
    private padcareFileRepository: Repository<PadcareFiles>,
  ) {}

  async findAll(
    user: User,
    pageOptionsDto: PageOptionsDto,
    cityId: number,
    date: Date,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    const clientId = user['clientId'] || null;
    const branchId = user['branchId'] || null;
    const cityIds = cityId ? [cityId] : user['cityIds'];
    let dateFilter = null;
    if (date) {
      let { firstDay, lastDay } = getFirstAndLastDayOfMonth(date);
      dateFilter = Between(firstDay, lastDay);
    }
    const baseConditions = {
      isActive: true,
      createdAt: dateFilter,
      city: { id: In(cityIds), isActive: true },
      client: { id: clientId },
      branch: { id: branchId },
      purchase: { id: Not(IsNull()) },
    };
    let where: any = search?.length
      ? [
          {
            ...baseConditions,
            client: { ...baseConditions.client, name: ILike(`%${search}%`) },
          },
          {
            ...baseConditions,
            name: ILike(`%${search}%`),
          },
        ]
      : baseConditions;

    if (where.length) {
      where.forEach(function (v: any) {
        if (!cityIds?.length) delete v?.city;
        if (!dateFilter) delete v.createdAt;
        if (!clientId) delete v.client.id;
        if (!branchId) delete v.branch;
      });
    } else {
      if (!cityIds?.length) delete where.city;
      if (!dateFilter) delete where.createdAt;
      if (!clientId) delete where.client;
      if (!branchId) delete where.branch;
    }

    let [list, count]: any = await this.branchRepository.findAndCount({
      withDeleted: true,
      relations: {
        client: true,
        city: true,
        purchase: true,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        client: {
          id: true,
          name: true,
        },
        city: {
          id: true,
          name: true,
        },
        purchase: {
          id: true,
          poNumber: true,
          soNumber: true,
        },
      },
      where: where,
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    for (let branch of list) {
      if (branch?.purchase?.length) {
        let purchaseIds = branch.purchase.map((i: any) => i.id);
        let purchaseFiles =
          await this.groupDocumentsBySoAndPoNumber(purchaseIds);
        branch['files'] = purchaseFiles;
      }
    }
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  // async groupPurchaseFilesByType(purchaseId: number) {
  //   try {
  //     const files = await this.padcareFileRepository.find({
  //       withDeleted: true,
  //       where: {
  //         purchase: { id: purchaseId },
  //       },
  //       relations: {
  //         fileId: true,
  //       },
  //       select: {
  //         fileId: {
  //           id: true,
  //           name: true,
  //           originalName: true,
  //           size: true,
  //           url: true,
  //           mimetype: true,
  //         },
  //       },
  //     });
  //     const grouped = {};
  //     if (files && files?.length) {
  //       files.forEach((obj: any) => {
  //         const { fileType, fileId } = obj;
  //         if (
  //           [ClientFiles.SALES_ORDER, ClientFiles.PURCHASE_ORDER].includes(
  //             fileType,
  //           )
  //         ) {
  //           if (!grouped[fileType]) {
  //             grouped[fileType] = [];
  //           }
  //           grouped[fileType].push(fileId);
  //         }
  //       });
  //     }
  //     return grouped;
  //   } catch (error) {
  //     console.log(
  //       'Document Service :: groupPurchaseFilesByType ==>',
  //       error?.message,
  //     );
  //   }
  // }
  async groupDocumentsBySoAndPoNumber(purchaseId: number[]) {
    try {
      const files = await this.padcareFileRepository.find({
        withDeleted: true,
        where: {
          purchase: { id: In(purchaseId) },
        },
        relations: {
          fileId: true,
          purchase: true,
        },
        select: {
          fileId: {
            id: true,
            name: true,
            originalName: true,
            size: true,
            url: true,
            mimetype: true,
          },
          purchase: {
            id: true,
            soNumber: true,
            poNumber: true,
          },
        },
      });
      const grouped = {};
      if (files && files?.length) {
        files.forEach((obj: any) => {
          const {
            fileType,
            fileId,
            purchase: { id, soNumber, poNumber },
          } = obj;
          if (fileType == ClientFiles.SALES_ORDER) {
            if (!grouped[fileType]) grouped[fileType] = {};
            if (soNumber && !grouped[fileType][soNumber])
              grouped[fileType][soNumber] = [];
            soNumber && grouped[fileType][soNumber].push(fileId);
          }
          if (fileType == ClientFiles.PURCHASE_ORDER) {
            if (!grouped[fileType]) grouped[fileType] = {};
            if (poNumber && !grouped[fileType][poNumber]) {
              grouped[fileType][poNumber] = [];
            }
            poNumber && grouped[fileType][poNumber].push(fileId);
          }
          if (
            [
              ClientFiles.AGREEMENT,
              ClientFiles.WORK_AUTHORIZATION_LETTER,
              ClientFiles.EMAIL_CONFIRMATION,
            ].includes(fileType)
          ) {
            // if (!grouped[`${fileType}`]) grouped[`${fileType}`] = {};
            if (!grouped[`${fileType}`]) {
              grouped[`${fileType}`] = [];
            }
            grouped[`${fileType}`].push(fileId);
          }
        });
      }
      return grouped;
    } catch (error) {
      console.log(
        'Document Service :: groupDocumentsBySoAndPoNumber ==>',
        error?.message,
      );
    }
  }
}
