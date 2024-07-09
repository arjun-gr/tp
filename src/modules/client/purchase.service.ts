import {
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Not, QueryRunner, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { ClientFiles } from '../../common/enums/client';
import { ContractStatus, ContractType } from '../../common/enums/contract';
import { ServiceType } from '../../common/enums/services';
import { BranchProduct } from '../../entities/branch-products.entity';
import { Branch } from '../../entities/branch.entity';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { Purchase } from '../../entities/purchase.entity';
import { Services } from '../../entities/services.entity';
import { User } from '../../entities/user.entity';
import { IConditions } from '../../interfaces/client';
import { IBranchProduct, IPurchaseDTO } from '../../interfaces/purchase';
import { getNewDate } from '../../utils/date.utils';
import {
  PADCARE_FILES_REPOSITORY,
  PURCHASE_REPOSITORY,
  SERVICE_REPOSITORY,
} from '../database/database.providers';
import { ServicesService } from '../services/services.service';
import { UserResponseCodes } from '../users/user.response.codes';
import { BranchProductService } from './branch-product.service';
import { ClientService } from './client.service';
import { BranchContractRequestDto } from './dto/branch-new-request.dto';

export class PurchaseService {
  queryRunner: QueryRunner;
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(PURCHASE_REPOSITORY)
    private purchaseRepository: Repository<Purchase>,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    @Inject(forwardRef(() => BranchProductService))
    private branchProductService: BranchProductService,
    @Inject(PADCARE_FILES_REPOSITORY)
    private padcareFileRepository: Repository<PadcareFiles>,
    @Inject(forwardRef(() => ServicesService))
    private service: ServicesService,
    @Inject(SERVICE_REPOSITORY)
    private serviceRepository: Repository<Services>,
  ) {}

  async throwIfPurchaseNotExists(id: number) {
    let purchase = await this.purchaseRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!purchase) throw UserResponseCodes.PURCHASE_NOT_EXISTS;
    return purchase;
  }

  async saveOrUpdatePurchaseDetails(
    queryRunner: QueryRunner,
    branch: Branch,
    dtoType: IPurchaseDTO,
    purchaseId?: number,
  ) {
    let dto = dtoType.addClient || dtoType.addBranch || dtoType.addContract;
    const purchase = new Purchase();
    if (!branch) {
      branch = await this.clientService.throwIfBranchNotExists(dto.branchId);
    }
    purchase.branch = branch;
    if (dto?.soNumber) purchase.soNumber = dto.soNumber;
    if (dto?.soReceivedDate) purchase.soReceivedDate = dto.soReceivedDate;
    if (dto?.poNumber) purchase.poNumber = dto.poNumber;
    if (dto?.paymentTerms) purchase.paymentTerms = dto.paymentTerms;
    if (dto?.billingFaq) purchase.billingFaq = dto.billingFaq;
    if (dto?.contractStartDate)
      purchase.contractStartDate = dto.contractStartDate;
    if (dto?.contractEndDate) purchase.contractEndDate = dto.contractEndDate;
    purchase.activePurchase = branch;
    purchase.status = ContractStatus.ACTIVE;
    purchase.type = dtoType?.addContract?.requestType
      ? dtoType?.addContract?.requestType
      : ContractType.NEW;
    // const purchaseCreated = await this.purchaseRepository.save(purchase);
    if (purchaseId) {
      await this.throwIfPurchaseNotExists(purchaseId);
      await queryRunner.manager.update(Purchase, { id: purchaseId }, purchase);
    } else {
      return await queryRunner.manager.save(Purchase, purchase);
    }
  }

  async getPurchaseList(branchId: number) {
    const contract = await this.purchaseRepository.find({
      where: { branch: { id: branchId } },
      withDeleted: true,
      relations: {
        branch: true,
      },
      select: {
        branch: { id: true },
      },
    });
    const list = contract?.map((purchase: any) => {
      return {
        id: purchase.id,
        soNumber: `${purchase.soNumber}`,
        poNumber: `${purchase.poNumber}`,
      };
    });
    return list;
  }

  async getAllPurchase(pageOptionsDto: PageOptionsDto, branchId: number) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;

    const [list, count] = await this.purchaseRepository.findAndCount({
      where: { branch: { id: branchId } },
      // withDeleted: true,
      relations: {
        branch: true,
      },
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  async getPurchaseDetailsById(purchaseId: number) {
    const purchase: any = await this.purchaseRepository.findOne({
      where: { id: purchaseId },
      withDeleted: true,
      relations: {
        branch: {
          client: {
            logo: true,
          },
          // user: true,
          city: true,
        },
        branchProduct: { product: true },
      },
      select: {
        id: true,
        isActive: true,
        soNumber: true,
        poNumber: true,
        type: true,
        soReceivedDate: true,
        billingFaq: true,
        paymentTerms: true,
        contractStartDate: true,
        installationDate: true,
        contractEndDate: true,
        deactivateReason: true,
        deactivatedAt: true,
        deletedAt: true,
        branch: {
          id: true,
          name: true,
          salesLead: true,
          isActive: true,
          contractPeriod: true,
          client: {
            id: true,
            name: true,
            logo: {
              url: true,
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
        },
      },
    });
    if (purchase?.deletedAt) return {};
    if (!purchase) throw new NotFoundException('Purchase Details Not Found');
    let purchaseFiles = await this.groupPurchaseFilesByType(purchaseId);
    let branchProduct: IBranchProduct =
      await this.branchProductService.getBranchProduct(purchase.branchProduct);
    delete purchase.branchProduct;
    purchase['branchProduct'] = branchProduct;
    purchase['files'] = purchaseFiles;
    return purchase;
  }

  async groupPurchaseFilesByType(purchaseId: number) {
    try {
      const files = await this.padcareFileRepository.find({
        where: {
          purchase: { id: purchaseId },
        },
        relations: {
          fileId: true,
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
        },
      });
      const grouped = {};
      if (files && files?.length) {
        files.forEach((obj: any) => {
          const { fileType, fileId } = obj;
          if (!grouped[fileType]) {
            grouped[fileType] = [];
          }
          grouped[fileType].push(fileId);
        });
      }
      return grouped;
    } catch (error) {
      console.log('PurchaseService :: groupPurchaseFilesByType ==> ', error);
    }
  }

  async getPurchaseStartAndEndDate(purchaseId: number) {
    await this.purchaseRepository.findOne({
      where: { id: purchaseId },
      select: {
        id: true,
        contractStartDate: true,
        contractEndDate: true,
      },
    });
  }

  async contractNewRequest(createClientDto , dto: BranchContractRequestDto,serviceDataDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // const user = await this.userService.throwIfUserNotExists(userId);
    // const client = await this.clientService.throwIfClientNotExists(
    //   dto.clientId,
    // );
    const branch = await this.clientService.getBranchPopulatedDetail(
      dto.branchId,
    );
    try {
      const purchaseCreated = await this.saveOrUpdatePurchaseDetails(
        queryRunner,
        branch,
        { addContract: dto },
      );

      await Promise.all([
        await this.branchProductService.saveFemaleHygieneUnitProduct(
          dto?.femaleHygieneUnit,
          purchaseCreated,
          branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachine(
          dto?.vendingMachine,
          purchaseCreated,
          branch,
          queryRunner,
        ),
        await this.branchProductService.saveSanitaryBuyoutPad(
          dto?.sanitaryPads,
          purchaseCreated,
          branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachinePads(
          dto?.vmPads,
          purchaseCreated,
          branch,
          queryRunner,
        ),
        await this.branchProductService.saveSimDetails(
          dto?.simRecharge,
          purchaseCreated,
          branch,
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.emailConfirmationFileId,
            fileType: ClientFiles.EMAIL_CONFIRMATION,
            user: user,
            city: branch.city,
            client: branch.client,
            branch: branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.workAuthorizationLetterFileId,
            fileType: ClientFiles.WORK_AUTHORIZATION_LETTER,
            user: user,
            city: branch.city,
            client: branch.client,
            branch: branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.purchaseOrderFileId,
            fileType: ClientFiles.PURCHASE_ORDER,
            user: user,
            city: branch.city,
            client: branch.client,
            branch: branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.salesOrderFileId,
            fileType: ClientFiles.SALES_ORDER,
            user: user,
            city: branch.city,
            client: branch.client,
            branch: branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.agreementFileId,
            fileType: ClientFiles.AGREEMENT,
            user: user,
            city: branch.city,
            client: branch.client,
            branch: branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.service.create({
          createClientDto,
          newContract: dto,
          user: user,
          city: branch.city,
          client: branch.client,
          branch: branch,
          purchase: purchaseCreated,
          type: ServiceType.INSTALLATION,
          date: getNewDate(10),
          serviceDto: serviceDataDto,
          queryRunner: queryRunner,
        }),
      ]);
      // re-active branch if it is deleted or deactivated.
      await queryRunner.manager.update(
        Branch,
        { id: branch.id },
        {
          isActive: true,
          deletedAt: null,
          deletedBy: null,
          deactivateReason: null,
          deletedReason: null,
        },
      );
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: 'New Contract created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('PurchaseService :: contractNewRequest ==> ', error);
      throw new Error(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async contractRenewalRequest(dto: BranchContractRequestDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchase: any = await this.getPurchaseDetailsByIds(dto.purchaseIds);
      const purchaseCreated = await this.saveOrUpdatePurchaseDetails(
        queryRunner,
        purchase.branch,
        { addContract: dto },
      );
      const branchProduct =
        await this.branchProductService.formatBranchProductResponse(
          purchase.purchases,
        );

      await Promise.all([
        await this.branchProductService.saveFemaleHygieneUnitProduct(
          branchProduct.femaleHygieneUnit,
          purchaseCreated,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachine(
          branchProduct.vendingMachine,
          purchaseCreated,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveSanitaryBuyoutPad(
          branchProduct.sanitaryPads,
          purchaseCreated,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachinePads(
          branchProduct.vendingMachinePads,
          purchaseCreated,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveSimDetails(
          branchProduct.sim,
          purchaseCreated,
          purchase.branch,
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.emailConfirmationFileId,
            fileType: ClientFiles.EMAIL_CONFIRMATION,
            user: user,
            city: purchase.city,
            client: purchase.client,
            branch: purchase.branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.workAuthorizationLetterFileId,
            fileType: ClientFiles.WORK_AUTHORIZATION_LETTER,
            user: user,
            city: purchase.city,
            client: purchase.client,
            branch: purchase.branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.purchaseOrderFileId,
            fileType: ClientFiles.PURCHASE_ORDER,
            user: user,
            city: purchase.city,
            client: purchase.client,
            branch: purchase.branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.salesOrderFileId,
            fileType: ClientFiles.SALES_ORDER,
            user: user,
            city: purchase.city,
            client: purchase.client,
            branch: purchase.branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.agreementFileId,
            fileType: ClientFiles.AGREEMENT,
            user: user,
            city: purchase.city,
            client: purchase.client,
            branch: purchase.branch,
            purchase: purchaseCreated,
          },
          queryRunner,
        ),
        await this.service.createMaintenanceServicesOfProduct(
          queryRunner,
          user,
          purchaseCreated,
        ),
      ]);

      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: 'Contract renewal successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('PurchaseService :: contractRenewalRequest ==> ', error);
      throw new Error(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async togglePurchaseActive(
    purchaseId: number,
    status: boolean,
    deactivatedBy?: User,
    reason?: string,
    queryRunnerParam?: QueryRunner,
    currentDate: Date = new Date()
  ) {
    let queryRunner: QueryRunner;
    if (!queryRunnerParam) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } else {
      queryRunner = queryRunnerParam;
    }
    try {
      const purchase: Purchase =
        await this.throwIfPurchaseNotExists(purchaseId);

      await queryRunner.manager.update(
        Purchase,
        { id: purchaseId },
        {
          isActive: status,
          deactivatedAt: status ? null : currentDate,
          deactivatedBy: status ? null : deactivatedBy,
          deactivateReason: reason && !status ? reason : '',
        },
      );
      await queryRunner.manager.update(
        BranchProduct,
        { purchase: purchase },
        {
          isActive: status,
          // deletedAt: status ? null : new Date(),
        },
      );

      await this.service.deactivateServicesByPurchaseId(
        purchaseId,
        status,
        queryRunner,
      );

      if (!queryRunnerParam) await queryRunner.commitTransaction();
      return {
        message: 'Contract Update successfully',
        data: {
          purchaseId: purchaseId,
          status: status,
        },
      };
    } catch (error: any) {
      if (!queryRunnerParam) await queryRunner.rollbackTransaction();
      console.log('PurchaseService :: togglePurchaseActive ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      if (!queryRunnerParam) await queryRunner.release();
    }
  }

  async deactivateContractsByBranchId(
    branchId: number,
    status: boolean,
    user: User,
    reason: string,
    queryRunner: QueryRunner,
  ) {
    const purchase: Purchase[] = await this.purchaseRepository.find({
      where: { branch: { id: branchId } },
    });
    if (purchase && purchase?.length) {
      for (const contract of purchase) {
        await this.togglePurchaseActive(
          contract.id,
          status,
          user,
          reason,
          queryRunner,
        );
      }
    }
  }

  async deleteContractsByBranchId(
    branchId: number,
    user: User,
    reason: string,
    queryRunner: QueryRunner,
    currentDate: Date = new Date()
  ) {
    const purchase: any[] = await this.purchaseRepository.find({
      where: { branch: { id: branchId } },
      withDeleted: true,
    });
    if (!purchase?.length) return;
    const purchaseIds = purchase.map((val: any) => val?.id);
    if (purchase && purchase?.length) {
      await queryRunner.manager.update(
        Purchase,
        { branch: { id: branchId } },
        {
          isActive: false,
          deletedAt: currentDate,
          deletedBy: user,
          deleteReason: reason ? reason : '',
        },
      );
      await queryRunner.manager.update(
        BranchProduct,
        { purchase: { id: In(purchaseIds) } },
        {
          isActive: false,
          deletedAt: currentDate,
        },
      );
      await queryRunner.manager.update(
        Services,
        { purchase: { id: In(purchaseIds) } },
        {
          isActive: false,
          deletedAt: currentDate,
        },
      );
    }
  }

  async deleteContract(user: User, purchaseId: number, reason: string,currentDate: Date = new Date()) {
    try {
      await this.branchProductService.deleteBranchProductsByPurchaseId(
        purchaseId,
      );
      await this.purchaseRepository.update(
        { id: purchaseId },
        {
          isActive: false,
          deletedAt: currentDate,
          deletedBy: user,
          deleteReason: reason ? reason : '',
        },
      );
      await this.serviceRepository.update(
        { purchase: { id: purchaseId }, type: ServiceType.INSTALLATION },
        {
          isActive: false,
          deletedAt: currentDate,
        },
      );

      return {
        statusCode: 200,
        message: 'contract deleted successfully',
      };
    } catch (error: any) {
      console.log('PurchaseService :: deleteContract ==>', error);
      throw new BadRequestException(error?.message);
    }
  }

  async getPurchaseDetailsByIds(purchaseIds: number[]) {
    const purchases: any = await this.purchaseRepository.find({
      where: { id: In(purchaseIds) },
      withDeleted: true,
      relations: {
        branch: {
          client: {
            logo: true,
          },
          user: true,
          city: true,
        },
        branchProduct: { product: true },
      },
      select: {
        id: true,
        isActive: true,
        soNumber: true,
        poNumber: true,
        type: true,
        soReceivedDate: true,
        billingFaq: true,
        paymentTerms: true,
        contractStartDate: true,
        installationDate: true,
        contractEndDate: true,
        deactivateReason: true,
        deactivatedAt: true,
        branch: {
          id: true,
          name: true,
          salesLead: true,
          isActive: true,
          contractPeriod: true,
          client: {
            id: true,
            name: true,
            logo: {
              url: true,
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
        },
      },
    });
    if (!purchases.length) throw new NotFoundException('Contracts Not Found');
    const branchProduct =
      await this.branchProductService.formatBranchProductResponse(purchases);
    return {
      purchases,
      city: purchases[0]?.branch?.city,
      client: purchases[0]?.branch?.client,
      branch: purchases[0]?.branch,
      branchProduct,
    };
  }

  async updateContract(
    purchaseId: number,
    user: User,
    dto: BranchContractRequestDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const purchase: Purchase = await this.purchaseRepository.findOne({
        where: { id: purchaseId },
        relations: {
          branch: {
            client: {
              logo: true,
            },
            user: true,
            city: true,
          },
          branchProduct: { product: true },
        },
      });
      if (!purchase) throw new NotFoundException('Purchase Details Not Found');
      const branchProduct = await this.branchProductService.getBranchProduct(
        purchase.branchProduct,
      );
      await Promise.all([
        await this.branchProductService.removeProductFromContract(
          queryRunner,
          branchProduct,
          dto,
        ),
        await this.saveOrUpdatePurchaseDetails(
          queryRunner,
          null,
          { addContract: dto },
          purchaseId,
        ),
        await this.branchProductService.saveFemaleHygieneUnitProduct(
          dto?.femaleHygieneUnit,
          purchase,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachine(
          dto?.vendingMachine,
          purchase,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveSanitaryBuyoutPad(
          dto?.sanitaryPads,
          purchase,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveVendingMachinePads(
          dto?.vmPads,
          purchase,
          purchase.branch,
          queryRunner,
        ),
        await this.branchProductService.saveSimDetails(
          dto?.simRecharge,
          purchase,
          purchase.branch,
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.emailConfirmationFileId,
            fileType: ClientFiles.EMAIL_CONFIRMATION,
            user: user,
            city: purchase.branch.city,
            client: purchase.branch.client,
            branch: purchase.branch,
            purchase: purchase,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.workAuthorizationLetterFileId,
            fileType: ClientFiles.WORK_AUTHORIZATION_LETTER,
            user: user,
            city: purchase.branch.city,
            client: purchase.branch.client,
            branch: purchase.branch,
            purchase: purchase,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.purchaseOrderFileId,
            fileType: ClientFiles.PURCHASE_ORDER,
            user: user,
            city: purchase.branch.city,
            client: purchase.branch.client,
            branch: purchase.branch,
            purchase: purchase,
          },
          queryRunner,
        ),
        await this.clientService.uploadClientOnBoardingDocument(
          {
            fileIds: dto?.salesOrderFileId,
            fileType: ClientFiles.SALES_ORDER,
            user: user,
            city: purchase.branch.city,
            client: purchase.branch.client,
            branch: purchase.branch,
            purchase: purchase,
          },
          queryRunner,
        ),
        await this.service.deleteInstallationServiceIfPresent(
          queryRunner,
          purchaseId,
        ),
        await this.service.create({
          newContract: dto,
          user: user,
          city: purchase.branch.city,
          client: purchase.branch.client,
          branch: purchase.branch,
          purchase: purchase,
          type: ServiceType.INSTALLATION,
          date: getNewDate(10),
          queryRunner: queryRunner,
        }),
      ]);

      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: 'contract update successfully',
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('PurchaseService :: updateContract ==> ', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description get total installed products total quantity
   * @param branchId
   * @returns
   */
  async getTotalUnitByBranch(branchId: number) {
    try {
      const unitCount = {
        fhuCount: 0,
        vmCount: 0,
      };
      const purchases: any = await this.purchaseRepository.find({
        where: {
          branch: { id: branchId },
          installationDate: Not(IsNull()),
          isActive: true,
        },
        // withDeleted: true,
        relations: {
          branch: true,
          branchProduct: { product: true },
        },
      });
      if (!purchases.length) return unitCount;
      const serviceProduct = await this.service.getServiceProductsByPurchaseId({
        branchId: [branchId],
        type: ServiceType.INSTALLATION,
        withoutGrouping: true,
      });
      const branchProduct =
        await this.branchProductService.formatBranchProductResponse(
          purchases,
          serviceProduct,
          false,
        );

      const fhuUnitCount = branchProduct?.femaleHygieneUnit.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.installedQuantity,
        0,
      );

      const vmUnitCount = branchProduct?.vendingMachine.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.installedQuantity,
        0,
      );

      return {
        fhuCount: fhuUnitCount || unitCount.fhuCount,
        vmCount: vmUnitCount || unitCount.vmCount,
      };
    } catch (error: any) {
      console.log('PurchaseService :: getTotalUnitByBranch ==> ', error);
      throw new BadRequestException(error?.message);
    }
  }

  async deactivatePurchaseById(
    purchaseId: number | number[],
    status: boolean = false,
    deactivatedBy: User = null,
    reason: string = null,
    currentDate: Date = new Date()
  ) {
    let where: any = {};
    let updateValue = {};
    if (typeof purchaseId == 'number') {
      where['id'] = purchaseId;
    }
    if (Array.isArray(purchaseId)) {
      where['id'] = In(purchaseId);
    }
    if (status) {
      updateValue['isActive'] = status;
      updateValue['deactivatedAt'] = null;
    } else {
      updateValue['isActive'] = status;
      updateValue['deactivatedAt'] = currentDate;
      updateValue['deactivatedBy'] = deactivatedBy;
      updateValue['deactivateReason'] = reason;
    }

    await this.purchaseRepository.update(where, updateValue);
  }

  async getPurchaseByPurchaseId(conditions: IConditions) {
    // let purchase: Purchase | Purchase[];
    let where: any = {};
    if (typeof conditions?.id == 'number') {
      where['id'] = conditions.id;
    }
    if (Array.isArray(conditions?.id)) {
      where['id'] = In(conditions.id);
    }
    const baseCondition = {
      where: { ...where, ...conditions.where },
      relations: conditions.relations || {},
      withDeleted: conditions.withDeleted || false,
    };

    if (conditions.findOne) {
      const purchase: Purchase =
        await this.purchaseRepository.findOne(baseCondition);
      if (!purchase) throw UserResponseCodes.PURCHASE_NOT_EXISTS;
      return purchase;
    } else {
      const purchase: Purchase[] =
        await this.purchaseRepository.find(baseCondition);
      if (!purchase?.length) throw UserResponseCodes.PURCHASE_NOT_EXISTS;
      return purchase;
    }
  }
}
