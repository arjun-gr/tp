import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DataSource,
  ILike,
  In,
  IsNull,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import {
  ClientFiles,
  ClientType,
  ClientTypes,
  IndustryList,
} from '../../common/enums/client';

import { InjectDataSource } from '@nestjs/typeorm';
import { Events } from '../../common/constants/events.constants';
import { ServiceType } from '../../common/enums/services';
import { UserType } from '../../common/enums/user-type';
import { Analytics } from '../../entities/analytics.entity';
import { Branch } from '../../entities/branch.entity';
import { City } from '../../entities/city.entity';
import { Clients } from '../../entities/clients.entity';
import { PadcareFiles } from '../../entities/padcare-files.entity';
import { Purchase } from '../../entities/purchase.entity';
import { SPOCS } from '../../entities/spoc.entity';
import { User } from '../../entities/user.entity';
import {
  ClientCreationDTO,
  IConditions,
  IPadcareFiles,
  ISaveOrUpdateBranch,
} from '../../interfaces/client';
import { calculateDateDifference } from '../../utils/app.utils';
import { addDays } from '../../utils/date.utils';
import { CityService } from '../city/city.service';
import {
  ANALYTICS_REPOSITORY,
  BRANCH_REPOSITORY,
  CLIENT_REPOSITORY,
  USER_REPOSITORY,
} from '../database/database.providers';
import { ServicesService } from '../services/services.service';
import { UserResponseCodes } from '../users/user.response.codes';
import { BranchProductService } from './branch-product.service';
import { clientResponseStructure } from './client-response.helpter';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateSPOCDto } from './dto/create-spoc.dto';
import { UpdateClientDetailDto } from './dto/update-client-detail.dto';
import { PurchaseService } from './purchase.service';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { Services } from 'src/entities/services.entity';
import { CryptoService } from 'src/providers/crypto.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    @Inject(CLIENT_REPOSITORY)
    private clientRepository: Repository<Clients>,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    private eventEmitter: EventEmitter2,
    @Inject(ANALYTICS_REPOSITORY)
    private analyticsRepository: Repository<Analytics>,
    private cityService: CityService,
    @Inject(forwardRef(() => ServicesService))
    private service: ServicesService,
    @Inject(forwardRef(() => BranchProductService))
    private branchProductService: BranchProductService,
    @Inject(forwardRef(() => PurchaseService))
    private purchaseService: PurchaseService,
    private cryptoService: CryptoService
  ) {}

  async createClient(createClientDto: CreateClientDto,serviceDto?:CreateServiceDto) {
  //  console.log(createClientDto);
   
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let createdUser: User, createBranch: Branch, purchaseCreated: Purchase , service : any;
    const city = await this.cityService.throwIfCityIdNotExists(
      createClientDto.city,
    );
    try {
      const createClient = await this.saveOrUpdateClientDetails(queryRunner, {
        newClient: createClientDto,
      });

      if (createClient?.id || createClientDto?.clientId) {
        createBranch = await this.saveOrUpdateBranchDetails(
          queryRunner,
          createClient,
          city,
          { addBranch: createClientDto },
        );
        if (createBranch.id) {
          createdUser = await this.saveUserDetails(
            queryRunner,
            createClient,
            createBranch,
            createClientDto,
          );
          createBranch = await this.saveBranchUser(
            queryRunner,
            createBranch,
            createdUser,
          );
          if (
            createClientDto?.femaleHygieneUnit?.length ||
            createClientDto?.vendingMachine?.length ||
            createClientDto?.sanitaryPads?.length ||
            createClientDto?.vmPads?.length ||
            createClientDto?.simRecharge?.length
          ) {
            purchaseCreated =
              await this.purchaseService.saveOrUpdatePurchaseDetails(
                queryRunner,
                createBranch,
                { addClient: createClientDto },
              );

            await Promise.all([
              await this.branchProductService.saveFemaleHygieneUnitProduct(
                createClientDto?.femaleHygieneUnit,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveVendingMachine(
                createClientDto?.vendingMachine,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveSanitaryBuyoutPad(
                createClientDto?.sanitaryPads,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveVendingMachinePads(
                createClientDto?.vmPads,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
              await this.branchProductService.saveSimDetails(
                createClientDto?.simRecharge,
                purchaseCreated,
                createBranch,
                queryRunner,
              ),
            ]);
          }
          service = await this.service.create({
            createClientDto,
            user: createdUser,
            city: city,
            client: createClient,
            branch: createBranch,
            purchase: purchaseCreated,
            type: ServiceType.INSTALLATION,
            date: createClientDto.installationDate,
            queryRunner,
            installationDate: createClientDto.installationDate,
            serviceDto: serviceDto,
            completedAt: createClientDto.completedAt,
          })
  
        }
        this.eventEmitter.emit(Events.CLIENT_ADDED, {
          data: { cityId: createClientDto.city },
        });
        await queryRunner.commitTransaction();
      }

      return {
        message: 'Client create successfully',
        data: {
          userId: createdUser?.id,
          client: createClient,
          branch: createBranch,
          purchase : purchaseCreated,
          service : service.service
        },
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('ClientService :: createClient ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllClients(
    pageOptionsDto: PageOptionsDto,
    clientType: ClientTypes,
    cityId: number,
    status: string,
  ) {
    const search = pageOptionsDto?.search;
    const order = pageOptionsDto.order;
    if (status && status !== 'deleted') {
      status = JSON.parse(status.toLowerCase());
    }
    let where: any = search?.length
      ? [
          {
            isActive: status,
            user: { userType: UserType.Client, isActive: true },
            city: { id: cityId, isActive: true },
            client: {
              name: ILike(`%${search}%`),
              isActive: true,
              type: clientType,
            },
            deletedAt: Not(IsNull()),
          },
          {
            isActive: status,
            user: { userType: UserType.Client, isActive: true },
            city: {
              name: ILike(`%${search}%`),
              isActive: true,
              id: cityId,
            },
            client: { isActive: true, type: clientType },
            deletedAt: Not(IsNull()),
          },
        ]
      : {
          isActive: status,
          city: { id: cityId },
          user: { userType: UserType.Client, isActive: true },
          client: { isActive: true, type: clientType },
          deletedAt: Not(IsNull()),
        };

    if (where.length) {
      where.forEach(function (v) {
        if (!clientType) delete v.client.type;
        if (!cityId) delete v.city.id;
        if (status == undefined || status == 'deleted') delete v.isActive;
        if (status !== 'deleted') delete v.deletedAt;
      });
    } else {
      if (!clientType) delete where.client.type;
      if (!cityId) delete where.city;
      if (status == undefined || status == 'deleted') delete where.isActive;
      if (status !== 'deleted') delete where.deletedAt;
    }

    if (!cityId) cityId = null;
    const [list, count] = await this.branchRepository.findAndCount({
      where: where,
      withDeleted: true,
      relations: {
        spocs: true,
        city: {
          users: {
            employeeProfile: true,
          },
        },
        client: true,
        user: true,
      },
      order: { createdAt: order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(clientResponseStructure(list), pageMetaDto);
  }

  async getClientDetailsById(clientId: number, cityId: number) {
    let where: any = {};
    if (clientId) {
      where['id'] = clientId;
    }
    if (cityId) {
      where['branches'] = { city: { id: cityId } };
    }
    let resp: any = await this.clientRepository.findOne({
      where: where,
      order: {
        branches: {
          activePurchase: {
            createdAt: 'DESC',
          },
        },
      },
      withDeleted: true,
      relations: {
        logo: true,
        branches: { city: true, user: true, activePurchase: true },
        ifmClient: true,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        logo: {
          id: true,
          url: true,
          name: true,
          size: true,
          mimetype: true,
          originalName: true,
        },
        industryType: true,
        ifmClient: {
          id: true,
          name: true,
        },
        type: true,
        branches: {
          id: true,
          name: true,
          isActive: true,
          billingAddress: true,
          siteAddress: true,
          gstNumber: true,
          femaleCount: true,
          contractStartDate: true,
          contractEndDate: true,
          deletedAt: true,
          deletedReason: true,
          deactivatedAt: true,
          deactivateReason: true,
          user: {
            id: true,
            name: true,
            userName: true,
            email: true,
          },
          city: {
            id: true,
            name: true,
          },
          activePurchase: {
            id: true,
            type: true,
            soNumber: true,
            poNumber: true,
            paymentTerms: true,
            billingFaq: true,
            soReceivedDate: true,
            contractStartDate: true,
            contractEndDate: true,
            createdAt: true,
            installationDate: true,
          },
        },
      },
    });
    if (!resp) {
      throw new NotFoundException('Client Not Exists');
    }
    resp.branches.map((branch) => {
      branch.activePurchase =
        branch.activePurchase && branch.activePurchase.length
          ? branch.activePurchase[0]
          : null;
    });
    return resp;
  }

  async deleteClient(clientId: number) {
    const clients = await this.throwIfClientNotExists(clientId);
    try {
      const user = await this.userRepository.findOne({
        where: {
          client: {
            id: clients.id,
          },
        },
        relations: {
          client: true,
        },
      });
      if (!user) throw UserResponseCodes.CLIENT_NOT_EXISTS;
      await this.clientRepository.softDelete(clientId);
      await this.userRepository.softDelete({
        client: {
          id: clients.id,
        },
      });
      return {
        message: 'Client delete successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async throwIfBranchNotExists(id: number) {
    const branch = await this.branchRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!branch) throw UserResponseCodes.BRANCH_NOT_EXISTS;
    return branch;
  }

  async throwIfClientNotExists(id: number) {
    let client = await this.clientRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!client) throw UserResponseCodes.CLIENT_NOT_EXISTS;
    return client;
  }

  async getCityListById(clientId: number) {
    const branch = await this.branchRepository.find({
      where: {
        client: { id: clientId },
      },
      relations: {
        city: true,
      },
      select: {
        city: {
          id: true,
          name: true,
        },
      },
    });
    return branch?.map((val: any) => val?.city);
  }

  async uploadClientOnBoardingDocument(
    padcareFile: IPadcareFiles,
    queryRunner?: QueryRunner,
  ) {
    let where: any = {};
    if (padcareFile.client) {
      where['client'] = { id: padcareFile.client.id };
    }
    if (padcareFile.branch) {
      where['branch'] = { id: padcareFile.branch.id };
    }
    if (padcareFile.city) {
      where['city'] = { id: padcareFile.city.id };
    }
    if (padcareFile.purchase) {
      where['purchase'] = { id: padcareFile.purchase.id };
    }
    if (padcareFile.service) {
      where['service'] = { id: padcareFile.service.id };
    }
    if (padcareFile.branchProduct) {
      where['branchProduct'] = { id: padcareFile.branchProduct };
    }
    if (padcareFile.serviceProduct) {
      where['serviceProduct'] = { id: padcareFile.serviceProduct };
    }
    if (padcareFile.fileType) {
      where['fileType'] = padcareFile.fileType;
    }
    await queryRunner.manager.delete(PadcareFiles, { ...where });
    if (padcareFile?.fileIds?.length) {
      for (const file of padcareFile?.fileIds) {
        const padcareFiles = new PadcareFiles();
        padcareFiles.fileId = file;
        padcareFiles.fileType = padcareFile.fileType;
        padcareFiles.user = padcareFile?.user;
        padcareFiles.client = padcareFile?.client;
        padcareFiles.branch = padcareFile?.branch;
        padcareFiles.city = padcareFile?.city;
        padcareFiles.purchase = padcareFile?.purchase;
        padcareFiles.service = padcareFile?.service;
        padcareFiles.branchProduct = padcareFile?.branchProduct;
        padcareFiles.serviceProduct = padcareFile?.serviceProduct;
        await queryRunner.manager.save(PadcareFiles, padcareFiles);
        // await this.padcareFileRepository.save(padcareFiles);
      }
    }
  }

  async throwErrorIfClientNameExists(name: string) {
    if (!name) return;
    const client = await this.clientRepository.findOne({
      where: {
        name: name,
      },
    });
    if (client) throw new BadRequestException('Client name already exists');
    return true;
  }

  async getAnalyticByClientId(
    clientId: number,
    cityId: number,
    branchId: number,
  ) {
    const queryBuilder = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .leftJoin('analytics.client', 'client')
      // .leftJoinAndSelect('analytics.branch', 'branch')
      // .leftJoinAndSelect('analytics.branch.city', 'city')
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
      .addSelect('client.name', 'clientName');

    if (cityId) {
      queryBuilder.where('city = :cityId', { cityId });
    }
    if (clientId) {
      queryBuilder.where('client = :clientId', { clientId });
    }
    if (branchId) {
      queryBuilder.where('branch = :branchId', { branchId });
    }
    const result = await queryBuilder.getRawMany();
    return result[0];
  }

  async getClients(user: User, search: string, isDirectClient: boolean) {
    let clientTypes: any = null,
      cities = null;
    if (isDirectClient) {
      clientTypes = ClientType.filter(
        (client: any) => client.name.indexOf('Direct') !== -1,
      ).map((val) => val.name);
    }
    if (user.userType == UserType.Employee) {
      cities = user.cities.map((val) => val.id);
    }
    let where = search?.length
      ? {
          isActive: true,
          userType: UserType.Client,
          // name: ILike(`%${search}%`),
          client: {
            name: ILike(`%${search}%`),
            type: In(clientTypes),
            isActive: true,
            branches: {
              city: { id: In(cities) },
            },
          },
        }
      : {
          isActive: true,
          userType: UserType.Client,
          client: {
            type: In(clientTypes),
            isActive: true,
            branches: {
              city: { id: In(cities) },
            },
          },
        };

    if (where) {
      if (!clientTypes) delete where.client.type;
      if (!cities?.length) delete where.client.branches;
    }

    const clients = await this.userRepository.find({
      where,
      select: {
        id: true,
        name: true,
        client: {
          id: true,
          type: true,
          name: true,
          branches: {
            id: true,
            name: true,
            city: {
              id: true,
              name: true,
            },
          },
        },
      },
      relations: {
        client: {
          branches: {
            city: true,
          },
        },
      },
    });

    return clients?.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.client.name === value.client.name),
    );
  }

  getIndustryList() {
    return IndustryList;
  }

  getClientTypeList() {
    return ClientType;
  }

  async saveSinglePointOfContact(
    spoc: CreateSPOCDto[],
    branch: Branch,
    queryRunner: QueryRunner,
  ) {
    if (!spoc?.length) return;
    for (const key of spoc) {
      const spoc = new SPOCS();
      spoc.branch = branch;
      spoc.name = key.name;
      spoc.email = key.email;
      spoc.phoneNumber = key.phoneNumber;
      await queryRunner.manager.save(SPOCS, spoc);
      // await this.spocRepository.save(spoc);
    }
  }

  async saveUserDetails(
    queryRunner: QueryRunner,
    client: Clients,
    branch: Branch,
    createClientDto:any,
  ) {
    const user = new User();
    user.name = client.name;
    user.userType = UserType.Client;
    user.client = client;
    user.branch = branch;
    user.email = createClientDto.Email;
    user.userName = createClientDto.userName;
    user.password = await this.cryptoService.generatePassword(
      createClientDto.Password,
    );
    // user.userName = createClientDto.;
    return await queryRunner.manager.save(User, user);
  }

  async saveOrUpdateClientDetails(
    queryRunner: QueryRunner,
    clientDto: ClientCreationDTO,
  ) {
    const dto = clientDto.newClient || clientDto.updateClient;    
    const client = new Clients();

    if (dto?.name) {
      await this.throwErrorIfClientNameExists(dto.name);
      client.name = dto.name;
    }
    if (dto?.clientType) client.type = dto.clientType;
    if (dto?.IFMClientId && dto?.clientType?.includes('IFM')) {
      const ifmClient = await this.throwIfClientNotExists(dto.IFMClientId);
      client.ifmClient = ifmClient;
    }
    if (dto?.logoId) client.logo = dto.logoId;
    if (dto?.industryType) client.industryType = dto.industryType;
    if (dto.clientId) {
      await queryRunner.manager.update(Clients, { id: dto.clientId }, client);
      return this.throwIfClientNotExists(dto.clientId)
    } else {
      return await queryRunner.manager.save(Clients, client);
    }
  }

  async saveOrUpdateBranchDetails(
    queryRunner: QueryRunner,
    client: Clients,
    city: City,
    branchDto: ISaveOrUpdateBranch,
  ) {
    const dto = branchDto?.addBranch || branchDto?.updateClient;
    let branch: Branch = new Branch();
    branch.client = client;
    branch.city = city;
    if (dto?.branchName) branch.name = dto.branchName;
    if (dto?.billingAddress) branch.billingAddress = dto.billingAddress;
    if (dto?.siteAddress) branch.siteAddress = dto.siteAddress;
    if (dto?.pincode) branch.pincode = dto?.pincode;
    if (dto?.gstNumber) branch.gstNumber = dto?.gstNumber;
    if (dto?.contractStartDate)
      branch.contractStartDate = dto.contractStartDate;
    if (dto?.contractEndDate) branch.contractEndDate = dto.contractEndDate;
    if (dto?.femaleCount) branch.femaleCount = dto.femaleCount;
    if (dto?.contractStartDate && dto?.contractEndDate) {
      const days = calculateDateDifference(
        dto.contractStartDate,
        dto.contractEndDate,
      );
      branch.contractPeriod = days;
    }
    if (dto?.salesLead) branch.salesLead = dto.salesLead;
    if (dto?.branchId) {
      await this.throwIfBranchNotExists(dto.branchId);
      await queryRunner.manager.update(Branch, { id: dto.branchId }, branch);
    } else {
      // createBranch = await this.branchRepository.save(branch);
      return await queryRunner.manager.save(Branch, branch);
    }
  }

  async saveBranchUser(queryRunner: QueryRunner, branch: Branch, user: User) {
    branch.user = user;
    return await queryRunner.manager.save(Branch, branch);
  }

  async updateClientAndBranch(dto: UpdateClientDetailDto, branchId?: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const client = await this.throwIfClientNotExists(dto.clientId);
      const city = await this.cityService.throwIfCityIdNotExists(dto.city);
      await this.saveOrUpdateClientDetails(queryRunner, { updateClient: dto });
      await this.saveOrUpdateBranchDetails(queryRunner, client, city, {
        updateClient: dto,
      });
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: 'Client branch Update successfully',
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('ClientService :: updateClientAndBranch ==>', error);
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getBranchPopulatedDetail(branchId: number) {
    const branch = await this.branchRepository.findOne({
      where: {
        id: branchId,
      },
      relations: {
        city: true,
        client: true,
      },
    });
    if (!branch) throw UserResponseCodes.BRANCH_NOT_EXISTS;
    return branch;
  }

  async getClientUserDetails(client: IConditions) {
    const { where, select, relations } = client;
    return await this.userRepository.find({
      where: where,
      select: select,
      relations: relations,
    });
  }
}
