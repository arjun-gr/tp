import {
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientFiles } from '../../common/enums/client';
import { ServiceType } from '../../common/enums/services';
import { BranchProduct } from '../../entities/branch-products.entity';
import { Branch } from '../../entities/branch.entity';
import { Purchase } from '../../entities/purchase.entity';
import { User } from '../../entities/user.entity';
import { IBranchProduct } from '../../interfaces/purchase';
import { getNewDate } from '../../utils/date.utils';
import { CityService } from '../city/city.service';
import {
  BRANCH_PRODUCT_REPOSITORY,
  BRANCH_REPOSITORY,
} from '../database/database.providers';
import { ServicesService } from '../services/services.service';
import { BranchProductService } from './branch-product.service';
import { ClientService } from './client.service';
import { AddBranchDto } from './dto/add-branch.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { PurchaseService } from './purchase.service';

export class BranchService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    @Inject(BRANCH_PRODUCT_REPOSITORY)
    private branchProductsRepository: Repository<BranchProduct>,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    private cityService: CityService,
    private service: ServicesService,
    @Inject(forwardRef(() => BranchProductService))
    private branchProductService: BranchProductService,
    @Inject(forwardRef(() => PurchaseService))
    private purchaseService: PurchaseService,
  ) {}

  async addBranch(dto: AddBranchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let client = null;
    if (dto.clientId) {
      client = await this.clientService.throwIfClientNotExists(dto.clientId);
    }

    const city = await this.cityService.throwIfCityIdNotExists(dto.city);
    try {
      let createdUser: User, createBranch: Branch, purchaseCreated: Purchase;
      if (client) {
        createBranch = await this.clientService.saveOrUpdateBranchDetails(
          queryRunner,
          client,
          city,
          { addBranch: dto },
        );

        if (createBranch.id) {
          createdUser = await this.clientService.saveUserDetails(
            queryRunner,
            client,
            createBranch,
            null,
          );
          await this.clientService.saveBranchUser(
            queryRunner,
            createBranch,
            createdUser,
          );
          if (
            dto?.femaleHygieneUnit?.length ||
            dto?.vendingMachine?.length ||
            dto?.sanitaryPads?.length ||
            dto?.vmPads?.length ||
            dto?.simRecharge?.length
          ) {
            purchaseCreated =
              await this.purchaseService.saveOrUpdatePurchaseDetails(
                queryRunner,
                createBranch,
                { addBranch: dto },
              );
            await Promise.all([
              await this.branchProductService.saveFemaleHygieneUnitProduct(
                dto?.femaleHygieneUnit,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveVendingMachine(
                dto?.vendingMachine,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveSanitaryBuyoutPad(
                dto?.sanitaryPads,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveVendingMachinePads(
                dto?.vmPads,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveSimDetails(
                dto?.simRecharge,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.service.create({
                addBranch: dto,
                user: createdUser,
                city: createBranch.city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
                type: ServiceType.INSTALLATION,
                date: getNewDate(10),
                queryRunner,
              }),
            ]);
          }

          await Promise.all([
            await this.clientService.saveSinglePointOfContact(
              dto.spoc,
              createBranch,
              queryRunner,
            ),
            await this.clientService.uploadClientOnBoardingDocument(
              {
                fileIds: dto?.purchaseOrderFileId,
                fileType: ClientFiles.PURCHASE_ORDER,
                user: createdUser,
                city: city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
              },
              queryRunner,
            ),
            await this.clientService.uploadClientOnBoardingDocument(
              {
                fileIds: dto?.salesOrderFileId,
                fileType: ClientFiles.SALES_ORDER,
                user: createdUser,
                city: city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
              },
              queryRunner,
            ),
            await this.clientService.uploadClientOnBoardingDocument(
              {
                fileIds: dto?.agreementFileId,
                fileType: ClientFiles.AGREEMENT,
                user: createdUser,
                city: city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
              },
              queryRunner,
            ),
            await this.clientService.uploadClientOnBoardingDocument(
              {
                fileIds: dto?.workAuthorizationLetterFileId,
                fileType: ClientFiles.WORK_AUTHORIZATION_LETTER,
                user: createdUser,
                city: city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
              },
              queryRunner,
            ),
            await this.clientService.uploadClientOnBoardingDocument(
              {
                fileIds: dto?.emailConfirmationFileId,
                fileType: ClientFiles.EMAIL_CONFIRMATION,
                user: createdUser,
                city: city,
                client: client,
                branch: createBranch,
                purchase: purchaseCreated,
              },
              queryRunner,
            ),
          ]);
        }

        await queryRunner.commitTransaction();
      }
      return {
        message: 'Branch added successfully',
        data: {
          userId: createdUser.id,
          clientId: client.id,
          branchId: createBranch.id,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('BranchService :: addBranch ==> ', error);
      throw new Error(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateBranch(dto: CreateClientDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const client = await this.clientService.throwIfClientNotExists(
      dto.clientId,
    );
    const city = await this.cityService.throwIfCityIdNotExists(dto.city);
    try {
      let createBranch: Branch;
      if (client) {
        createBranch = await this.clientService.saveOrUpdateBranchDetails(
          queryRunner,
          client,
          city,
          { addBranch: dto },
        );
        await queryRunner.commitTransaction();
      }
      return {
        message: 'Branch updated successfully',
        data: {
          clientId: client.id,
          branchId: createBranch.id,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('BranchService :: updatebranch ==> ', error);
      throw new Error(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async toggleBranchActive(
    branchId: number,
    status: boolean,
    deactivatedBy?: User,
    reason?: string,
    currentDate: Date = new Date()
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // await this.clientService.throwIfBranchNotExists(branchId);
      await queryRunner.manager.update(
        Branch,
        { id: branchId },
        {
          isActive: status,
          deactivatedAt: status ? null : currentDate,
          deactivatedBy: status ? null : deactivatedBy,
          deactivateReason: reason && !status ? reason : '',
        },
      );
      await this.purchaseService.deactivateContractsByBranchId(
        branchId,
        status,
        deactivatedBy,
        reason,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return {
        message: 'Branch status update successfully',
        data: {
          branchId: branchId,
          status: status,
        },
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('BranchService :: toggleBranchActive ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getBranchDetails(branchId: number) {
    let branch: any = await this.branchRepository.findOne({
      where: { id: branchId },
      withDeleted: true,
      relations: {
        client: { logo: true, ifmClient: true },
        user: true,
        spocs: true,
        city: true,
        purchase: {
          branchProduct: { product: true },
        },
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        billingAddress: true,
        siteAddress: true,
        pincode: true,
        gstNumber: true,
        femaleCount: true,
        contractPeriod: true,
        salesLead: true,
        deactivatedAt: true,
        deactivateReason: true,
        deletedAt: true,
        deletedReason: true,
        client: {
          id: true,
          name: true,
          logo: {
            id: true,
            url: true,
            name: true,
            originalName: true,
          },
          type: true,
          industryType: true,
          ifmClient: {
            id: true,
            name: true,
          },
        },
        city: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
          userName: true,
          email: true,
        },
        spocs: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    });
    if (branch?.deletedAt) delete branch.purchase;
    if (!branch) throw new NotFoundException('Branch Not Found');
    branch.purchase = branch?.purchase?.filter((obj) => !obj?.deletedAt);
    let purchaseFiles: any = {};
    if (branch?.purchase?.length) {
      const purchaseIds = branch.purchase.map((val: any) => val.id);
      const serviceProduct = await this.service.getServiceProductsByPurchaseId({
        branchId: [branchId],
        purchaseIds: purchaseIds,
        type: ServiceType.INSTALLATION,
        withoutGrouping: true,
      });
      for (const purchase of branch?.purchase) {
        if (purchase?.id) {
          purchaseFiles = await this.purchaseService.groupPurchaseFilesByType(
            purchase.id,
          );
          if (purchaseFiles) purchase['files'] = purchaseFiles;
          const serviceProd = serviceProduct.filter(
            (val: any) => val?.service?.purchase?.id == purchase?.id,
          );

          let branchProduct: IBranchProduct =
            await this.branchProductService.getBranchProduct(
              purchase.branchProduct,
              serviceProd,
            );
          delete purchase.branchProduct;
          purchase['branchProducts'] = branchProduct;
        }
      }
    }

    return branch;
  }

  async getProductListByBranch(branchId: number) {
    const branch: Branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: {
        purchase: {
          branchProduct: { product: true },
        },
      },
      select: {
        id: true,
        purchase: {
          id: true,
        },
      },
    });
    if (branch?.deletedAt) delete branch.purchase;
    if (!branch) throw new NotFoundException('Branch Not Found');
    branch.purchase = branch?.purchase?.filter((obj) => !obj?.deletedAt);
    let product = await this.branchProductService.getProductByPurchase(
      branch.purchase,
    );
    branch['products'] = product;
    return branch;
  }

  async getBranchList(clientId: number, cityId: number, branchId: number) {
    let where: any = {};
    if (clientId) where.client = { id: clientId };
    if (cityId) where.city = { id: cityId };
    if (branchId) where.id = branchId;
    return await this.branchRepository.find({
      where: where,
      relations: {
        user: true,
      },
      select: {
        id: true,
        name: true,
        user: {
          userName: true,
        },
        pincode: true,
      },
    });
  }

  async getProductByPurchase(purchaseId: number) {
    const branch = await this.branchProductsRepository.find({
      where: { purchase: { id: purchaseId } },
      relations: {
        product: true,
      },
      select: {
        id: true,
        quantity: true,
        serviceType: true,
        serviceCost: true,
        rentalAmount: true,
        buyoutAmount: true,
        refillingQuantity: true,
        refillingAmount: true,
        product: {
          id: true,
          name: true,
          type: true,
        },
      },
    });
    const grouped = {};
    if (branch && branch?.length) {
      branch.forEach((obj: any) => {
        const {
          product: { type },
        } = obj;
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(obj);
      });
    }
    return grouped;
  }

  async deleteBranch(user: User, branchId: number, reason: string,currentDate: Date = new Date()) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // await this.clientService.throwIfBranchNotExists(branchId);
      await queryRunner.manager.update(
        Branch,
        { id: branchId },
        {
          isActive: false,
          deletedAt: currentDate,
          deletedBy: user,
          deletedReason: reason ? reason : '',
        },
      );
      await this.purchaseService.deleteContractsByBranchId(
        branchId,
        user,
        reason,
        queryRunner,
      );
      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('BranchService :: deleteBranch ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }
}
