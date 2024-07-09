import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { VM_SERVICE_TYPE } from '../../common/enums/client';
import { UserType } from '../../common/enums/user-type';
import { City } from '../../entities/city.entity';
import { ClientService } from '../client/client.service';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { CreateSPOCDto } from '../client/dto/create-spoc.dto';
import { CreateFemaleHygieneUnitDto } from '../client/dto/female-hygiene-unit.dto';
import { CreateSanitaryPadDto } from '../client/dto/sanitary-pad.dto';
import { CreateSimCardDto } from '../client/dto/sim-card.dto';
import { CreateVendingMachineDto } from '../client/dto/vending-machine.dto';
import { ProductService } from '../product/product.service';
import {
  CLIENT_INFO,
  PRODUCT_INFO,
  SERVICES,
  client_const,
  misc_const,
  product_const,
  sanitary_pad,
  sim_const,
  vm_const,
  vm_pads,
} from './constants';
import { AddClientSchema } from './schemas';
import { States } from 'src/entities/states.entity';
import { CreateCityDto } from '../city/dto/request/create-city.dto';
import { Tier } from 'src/common/enums/tiers';
import { Clients } from 'src/entities/clients.entity';
import { Branch } from 'src/entities/branch.entity';
import {
  BRANCH_REPOSITORY,
  CITY_REPOSITORY,
  CLIENT_REPOSITORY,
  STATE_REPOSITORY,
  USER_REPOSITORY,
} from '../database/database.providers';
import { PurchaseService } from '../client/purchase.service';
import { BranchContractRequestDto } from '../client/dto/branch-new-request.dto';
import { ServiceStatus, ServiceType } from 'src/common/enums/services';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { ServicesService } from '../services/services.refactor.service';
import { Services } from 'src/entities/services.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { CreateMaintenanceServiceDto } from '../services/dto/create-maintaince-services.dto';
import { SetPasswordDto } from '../users/dto/set-password.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CryptoService } from 'src/providers/crypto.service';
import { plainToClass } from 'class-transformer';
import { ICreateClientEntity } from 'src/interfaces/client';
import { ISaveUserCredentials } from 'src/interfaces/userCredential';
import { calculateDateDifference } from 'src/utils/app.utils';
import { AddBranchDto } from '../client/dto/add-branch.dto';
import { BranchService } from '../client/branch.service';
import { setDefaultResultOrder } from 'dns';

@Injectable()
export class ExcelService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(CITY_REPOSITORY)
    private cityRepository: Repository<City>,
    @Inject(STATE_REPOSITORY)
    private stateRepository: Repository<States>,
    @Inject(CLIENT_REPOSITORY)
    private clientsRepository: Repository<Clients>,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    private clientService: ClientService,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private service: ServicesService,
    @Inject(USER_REPOSITORY)
    private usersRepository: Repository<User>,
    private userService: UsersService,
    @Inject(CryptoService)
    private cryptoService: CryptoService,
    @Inject(BranchService)
    private branchService: BranchService,
  ) {}

  async uniqueCities(clientInfo: any) {
    const [allCitiesFromDb, allStatesFromDb] = await Promise.all([
      await this.cityRepository.query(`select * from cities`),
      await this.stateRepository.query(`select * from states`),
    ]);

    const cityNames = allCitiesFromDb.map((city: any) => city.name);

    const uniqueCitiesSet = new Set(cityNames);
    const uniqueCitiesArray = [];

    for (const elem of clientInfo) {
      const cityName = elem.City;
      const stateName = elem.State;

      if (
        !uniqueCitiesSet.has(cityName) &&
        !allCitiesFromDb.some((city: any) => city.name === cityName)
      ) {
        uniqueCitiesSet.add(cityName);
        uniqueCitiesArray.push({ city: cityName, state: stateName });
      }
    }

    const uniqueCityObj: any = [];

    for (const cityObj of uniqueCitiesArray) {
      const createCityDto = new CreateCityDto();
      createCityDto.name = cityObj.city;
      createCityDto.tier = Tier.T1;
      createCityDto.state = allStatesFromDb.find((s) => s.name == cityObj.state)
        ?.id;
      uniqueCityObj.push(createCityDto);
    }

    if (uniqueCityObj.length)
      await this.cityRepository.insert(
        this.cityRepository.create(uniqueCityObj),
      );

    const allCities = await this.cityRepository.query(
      `select name,id from cities`,
    );
    const allCitiesObj = {};

    // used map instead of forEach
    allCities.map((elem: any) => {
      allCitiesObj[elem.name] = elem.id;
    });

    // console.log(uniqueCitiesArray);

    return allCitiesObj;
  }

  async readXlsxFile(filePath: string) {
    const data = fs.readFileSync(path.join(filePath));
    const workbook = xlsx.read(data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const clientInfo: any = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
    });

    const sheetName1 = workbook.SheetNames[1];
    const worksheet1 = workbook.Sheets[sheetName1];
    const productInfo: any = xlsx.utils.sheet_to_json(worksheet1, {
      raw: false,
    });
    return { clientInfo, productInfo };
  }

  getUniqueClientsFromSheet(clientInfoSheet: any) {
    const uniqueClientNames = [];
    clientInfoSheet.map((client: any) => {
      const clientName = client[client_const.CLIENT_NAME];
      if (clientName && !uniqueClientNames.includes(clientName)) {
        uniqueClientNames.push(clientName);
      }
    });
    return uniqueClientNames;
  }

  async getFinalObjectData(
    clientInfo: any,
    productInfo: any,
    clientTblData: any[],
  ) {
    const finalData = [];
    for (const client of clientInfo) {
      const product = productInfo.filter(
        (i: any) =>
          i[client_const.BRANCH_NAME] === client[client_const.BRANCH_NAME] &&
          i[client_const.CLIENT_NAME] === client?.[client_const.CLIENT_NAME] &&
          i[client_const.CLIENT_CITY] == client?.[client_const.CLIENT_CITY],
      );

      if (product?.length) {
        const groupByClient = await this.groupDataByClient(product);
        const groupByBranch = await this.groupDataByBranch(
          groupByClient,
          client,
        );
        finalData.push(...groupByBranch);
      } 
      else{
        const checkClientExists = clientTblData.find(
          (obj) => obj.name == client[client_const.CLIENT_NAME],
        );
  
        if (checkClientExists) {
          // Check if the branch already exists for this client
          const existingBranch = await this.branchRepository.findOne({
            where: {
              name: client[client_const.BRANCH_NAME],
              city: {
                name: client[client_const.CLIENT_CITY]
              },
              client: {
                id: checkClientExists.id
              }
            }
          });
  
          if (!existingBranch) {
            let branchDto = new Branch();
            let city = new City();
            let matchedCity = await this.cityRepository.findOne({ where: { name: client[CLIENT_INFO.CITY] } });
            city.id = matchedCity.id;
  
            let clients = new Clients();
            clients.id = checkClientExists.id;
  
            branchDto.name = client[CLIENT_INFO.BRANCH_NAME];
            branchDto.billingAddress = client[CLIENT_INFO.BILLING_ADDRESS];
            branchDto.siteAddress = client[CLIENT_INFO.SITE_ADDRESS];
            branchDto.gstNumber = client[CLIENT_INFO.GST_NO];
            branchDto.femaleCount = client[CLIENT_INFO.FEMALE_COUNT];
            branchDto.salesLead = client[PRODUCT_INFO.SALES_LEAD];
            branchDto.contractStartDate = client[CLIENT_INFO.CONTRACT_START_DATE];
            branchDto.contractEndDate = client[CLIENT_INFO.CONTRACT_END_DATE];
            branchDto.contractPeriod = calculateDateDifference(client[CLIENT_INFO.CONTRACT_START_DATE], client[CLIENT_INFO.CONTRACT_END_DATE]);
            branchDto.salesLead = client[CLIENT_INFO.SALES_LEAD];
            branchDto.city = city;
            branchDto.client = clients;
            branchDto.pincode = client[CLIENT_INFO.PINCODE];
  
            console.table(branchDto);
  
            let branchData = await this.branchRepository.save(branchDto);
  
            const savedUserCredentials = await this.createUserEntityInstance({
              name: client[CLIENT_INFO.CLIENT_NAME],
              userName: client[CLIENT_INFO.USERNAME],
              email: client[CLIENT_INFO.EMAIL],
              password: client[CLIENT_INFO.PASSWORD],
              userType: UserType.Client,
              client: clients,
              branch: branchData,
            });
  
            let userData = await this.usersRepository.save(savedUserCredentials);
            branchData.user = savedUserCredentials;
            await this.branchRepository.save(branchData);
          }
        } else {
          const result = this.createClientEntityInstance({
            name: client[client_const.CLIENT_NAME],
            type: client[client_const.CLIENT_TYPE],
            industryType: client[client_const.INDUSTRY_TYPE],
          });
  
          const createdClient = await this.clientsRepository.save(result);
          clientTblData.push(createdClient);
  
          let branchDto = new Branch();
          let city = new City();
          let matchedCity = await this.cityRepository.findOne({ where: { name: client[CLIENT_INFO.CITY] } });
          city.id = matchedCity.id;
  
          let clients = new Clients();
          clients.id = createdClient.id;
  
          branchDto.name = client[CLIENT_INFO.BRANCH_NAME];
          branchDto.billingAddress = client[CLIENT_INFO.BILLING_ADDRESS];
          branchDto.siteAddress = client[CLIENT_INFO.SITE_ADDRESS];
          branchDto.gstNumber = client[CLIENT_INFO.GST_NO];
          branchDto.femaleCount = client[CLIENT_INFO.FEMALE_COUNT];
          branchDto.salesLead = client[PRODUCT_INFO.SALES_LEAD];
          branchDto.contractStartDate = client[CLIENT_INFO.CONTRACT_START_DATE];
          branchDto.contractEndDate = client[CLIENT_INFO.CONTRACT_END_DATE];
          branchDto.contractPeriod = calculateDateDifference(client[CLIENT_INFO.CONTRACT_START_DATE], client[CLIENT_INFO.CONTRACT_END_DATE]);
          branchDto.salesLead = client[CLIENT_INFO.SALES_LEAD];
          branchDto.city = city;
          branchDto.client = clients;
          branchDto.pincode = client[CLIENT_INFO.PINCODE];
  
          // console.table(branchDto);
  
          let branchData = await this.branchRepository.save(branchDto);
  
          const savedUserCredentials = await this.createUserEntityInstance({
            name: client[CLIENT_INFO.CLIENT_NAME],
            userName: client[CLIENT_INFO.USERNAME],
            email: client[CLIENT_INFO.EMAIL],
            password: client[CLIENT_INFO.PASSWORD],
            userType: UserType.Client,
            client: clients,
            branch: branchData,
          });
  
          let userData = await this.usersRepository.save(savedUserCredentials);
          branchData.user = savedUserCredentials;
          await this.branchRepository.save(branchData);
        }
      }
    }
    return finalData;
  }

  async create() {
    try {
      const xlsxFilePath = path.join(
        __dirname,
        '../',
        '../../../assets/Book1.xlsx',
      );
      const { clientInfo, productInfo } = await this.readXlsxFile(xlsxFilePath);

      const [cityList, clientTblData /*finalData*/] = await Promise.all([
        await this.uniqueCities(clientInfo),
        await this.getClients(clientInfo),
        // await this.getFinalObjectData(clientInfo, productInfo),
      ]);

      const finalData = await this.getFinalObjectData(
        clientInfo,
        productInfo,
        clientTblData,
      );

      const clientDtoArray = [];
      for (const data of finalData) {
        const clientName = data[client_const.CLIENT_NAME] || null;
        const cityName = data[client_const.CLIENT_CITY] || null;
        const client = this.getClientByClientName(clientTblData, clientName);
        const cityId = this.getCityIdByCityName(cityList, cityName);

        const clientDto = new CreateClientDto();
        this.createClientDto(clientDto, client, cityId, data);

        // explain below code
        const serviceDataDto = this.createServiceDto(data);

        clientDtoArray.push(clientDto);
        
        if (clientDto?.clientId && clientDto?.branchId && clientDto?.city) {
          const contractDto = this.createContractRequestDTO(
            clientDto?.clientId,
            clientDto?.branchId,
            clientDto?.city,
            data,
          );

          await this.purchaseService.contractNewRequest(clientDto, contractDto,serviceDataDto, null);
          
        } else {
          const isValidDto = true; //await this.dtoValidationFunction(clientDto);
          if (isValidDto) {
            await this.createClientEntity(
              clientDto,
              clientTblData,
              serviceDataDto,
            );
          }
        }
      }
      return clientDtoArray;
    } catch (err) {
      console.log(err);
    }
  }

  async getBranchProducts(products: any[], client: any) {
    const { femaleHygieneUnitIds, vendingMachineIds } =
      await this.getAllProductsIds();
    const response = {
      errors: [],
      femaleHygieneUnit: [],
      vendingMachine: [],
      sim: [],
      vendingMachinePads: [],
      sanitaryPads: [],
      spoc: [],
      soNumber: '',
      poNumber: '',
      paymentTerms: '',
      billingFaq: '',
      soReceivedDate: '',
      contractStartDate: '',
      contractEndDate: '',
      femaleCount: '',
      salesLead: '',
      actualServiceDate: '',
      rating: 0,
      totalServiceCost: 0,
      wastePadCollection: 0,
      clientOnboardingProduct: null,
      isInvoiceSubmitted: null,
      invoiceOther: null,
      vehicleUsed: null,
      otherVehicleDetails: null,
      binMaintenancePart: null,
      otherBinMaintenancePart: null,
      binMaintenancePartQty: null,
      serviceInvoiceAmount: null,
      invoiceAmount: null,
      stickers: null,
      agentName: null,
      installationDate: null,
      installationMonth: null,
      completedAt: null,
    };

    for (const product of products) {
      response.soNumber = product[misc_const.SO_NO];
      response.poNumber = product[misc_const.PO_NO];
      response.paymentTerms = product[misc_const.PAYMENT_TERMS];
      response.billingFaq = product[misc_const.BILLING_FAQ];
      response.soReceivedDate = product[misc_const.SO_RECEIVED_DATE];
      response.contractStartDate = product[misc_const.CONTRACT_START_DATE];
      response.contractEndDate = product[misc_const.CONTRACT_END_DATE];
      response.femaleCount =
        product[client_const.CLIENT_NAME] === client[client_const.CLIENT_NAME]
          ? client['femaleCount']
          : null;
      response.salesLead = product[misc_const.SALES_LEAD];
      response.totalServiceCost =
        product[product_const.TOTAL_INSTALLATION_COST];
      response.clientOnboardingProduct =
        product[product_const.CLIENT_ON_BOARDING_PRODUCT];
      response.invoiceAmount = product[product_const.INVOICE_AMOUNT];
      response.stickers = product[product_const.STICKERS];
      response.agentName = product[product_const.AGENT_NAME];
      response.installationDate = product?.[product_const.INSTALLATION_DATE];
      response.installationMonth = product[product_const.INSTALLATION_MONTH];
      response.completedAt =
        product[PRODUCT_INFO.INSTALLATION_COMPLETED_AT];
      this.createFhuProductObj(product, response, femaleHygieneUnitIds);
      this.createVMProductObj(product, response, vendingMachineIds);
      this.createSanitaryPadsObj(product, response);
      this.createSimSectionObj(product, response);
      this.createSPOCSectionObj(product, response);
      this.createVMPadProductsObj(product, response);
    }
    let finalReturnObj = { ...response, ...client }
    return finalReturnObj;
  }

  async groupDataBySO(products: any[], client: any) {
    const group = {};
    const newGroup = [];
    for (const product of products) {
      const soNumber = product[misc_const.SO_NO];
      if (soNumber && !group[soNumber]) {
        group[soNumber] = [];
      }

      soNumber && group[soNumber].push(product);
    }

    for (const key in group) {
      const product = await this.getBranchProducts(group[`${key}`], client);

      newGroup.push({ ...product });
    }
    return newGroup;
  }

  createFhuProductObj(product: any, response: any, productIds: any[]) {
    // console.log(product)
    if (
      product[PRODUCT_INFO.TYPE_OF_BIN] &&
      product[PRODUCT_INFO.BIN_SERVICE_TYPE] &&
      product[PRODUCT_INFO.BIN_QTY] &&
      product[PRODUCT_INFO.BIN_RATE] &&
      product[PRODUCT_INFO.BIN_TOTAL_AMOUNT]
    ) {
      const productId = this.getProductIdByName(
        productIds,
        product[PRODUCT_INFO.TYPE_OF_BIN],
      );
      const fhu = new CreateFemaleHygieneUnitDto();
      fhu.productId = productId;
      fhu.quantity = product[PRODUCT_INFO.BIN_QTY];
      fhu.serviceCost = product[PRODUCT_INFO.BIN_RATE];
      fhu.totalServiceCost = product[PRODUCT_INFO.BIN_TOTAL_AMOUNT];
      fhu.serviceType = product[PRODUCT_INFO.BIN_SERVICE_TYPE];
      fhu.installedQuantity = product[PRODUCT_INFO.BIN_INSTALLED_QUANTITY];
      response.femaleHygieneUnit.push(fhu);
    }
  }

  createVMProductObj(product: any, response: any, productIds: any[]) {
    if (
      product[vm_const.TYPE_OF_VM] &&
      product[vm_const.VM_DEPLOYMENT_TYPE] &&
      product[vm_const.VM_QTY] &&
      (product[vm_const.VM_BUYOUT_AMT] || product[vm_const.VM_RENTAL_AMT]) &&
      product[vm_const.VM_TOTAL_AMT]
    ) {
      const productId = this.getProductIdByName(
        productIds,
        product[vm_const.TYPE_OF_VM],
      );
      const vm = new CreateVendingMachineDto();
      vm.productId = productId;
      vm.quantity = product[vm_const.VM_QTY];
      vm.rentalAmount = product[vm_const.VM_RENTAL_AMT];
      vm.buyoutAmount = product[vm_const.VM_BUYOUT_AMT];
      vm.totalServiceCost = product[vm_const.VM_TOTAL_AMT];
      vm.deploymentType =
        product[vm_const.VM_DEPLOYMENT_TYPE] == VM_SERVICE_TYPE.RENTAL
          ? VM_SERVICE_TYPE.RENTAL
          : VM_SERVICE_TYPE.BUYOUT;
      vm.serviceType = product[vm_const.VM_SERVICE_FREQUENCY];
      vm.installedQuantity = product[vm_const.VM_INSTALLED_QTY];
      response.vendingMachine.push(vm);
    }
  }

  createVMPadProductsObj(product: any, response: any) {
    if (
      product[vm_pads.VM_PAD_BRAND] &&
      product[vm_pads.VM_PAD_QTY] &&
      product[vm_pads.VM_PAD_COST] &&
      product[vm_pads.VM_PAD_TOTAL_COST]
    ) {
      const vmPad = new CreateSanitaryPadDto();
      vmPad.padBrand = product[vm_pads.VM_PAD_BRAND];
      vmPad.quantity = product[vm_pads.VM_PAD_QTY];
      vmPad.cost = product[vm_pads.VM_PAD_COST];
      vmPad.totalCost = product[vm_pads.VM_PAD_TOTAL_COST];
      vmPad.installedQuantity = product[vm_pads.VM_PADS_INSTALLED_QTY];
      response.vendingMachinePads.push(vmPad);
    }
  }

  async createSanitaryPadsObj(product: any, response: any) {
    if (
      product[sanitary_pad.SANITARY_PAD_BRAND] &&
      product[sanitary_pad.SANITARY_PAD_QTY] &&
      product[sanitary_pad.SANITARY_PAD_COST] &&
      product[sanitary_pad.SANITARY_PAD_TOTAL_COST]
    ) {
      const sanitaryPad = new CreateSanitaryPadDto();
      sanitaryPad.padBrand = product[sanitary_pad.SANITARY_PAD_BRAND];
      sanitaryPad.quantity = product[sanitary_pad.SANITARY_PAD_QTY];
      sanitaryPad.cost = product[sanitary_pad.SANITARY_PAD_COST];
      sanitaryPad.totalCost = product[sanitary_pad.SANITARY_PAD_TOTAL_COST];
      sanitaryPad.installedQuantity = product[sanitary_pad.SANITARY_PAD_QTY];
      response.sanitaryPads.push(sanitaryPad);
    }
  }

  async createSimSectionObj(product: any, response: any) {
    if (
      product[sim_const.SIM_BRAND] &&
      product[sim_const.SIM_QTY] &&
      product[sim_const.SIM_PRICE]
    ) {
      const sim = new CreateSimCardDto();
      sim.simNumber = product[sim_const.SIM_NUMBER];
      sim.simBrand = product[sim_const.SIM_BRAND];
      sim.quantity = product[sim_const.SIM_QTY];
      sim.price = product[sim_const.SIM_PRICE];
      sim.totalAmount =
        parseInt(product[sim_const.SIM_PRICE]) *
        parseInt(product[sim_const.SIM_QTY]);
      response.sim.push(sim);
    }
  }

  async createSPOCSectionObj(product: any[], response: any) {
    if (product['SPOC Name']) {
      const spoc = new CreateSPOCDto();
      spoc.name = product[misc_const.SPOC_NAME];
      spoc.email = product[misc_const.SPOC_EMAIL];
      spoc.phoneNumber = product[misc_const.SPOC_PHONE];
      response.spoc.push(spoc);
    }
  }

  async getClients(sheetData: any) {
    if (!sheetData && !sheetData.length) return;
    const names = this.getUniqueClientsFromSheet(sheetData);

    return this.clientsRepository.find({
      where: {
        name: In(names),
      },
      relations: {
        branches: { city: true, purchase: true },
      },
      select: {
        branches: {
          id: true,
          name: true,
          city: {
            id: true,
            name: true,
          },
          purchase: {
            id: true,
            soNumber: true,
            contractEndDate: true,
            contractStartDate: true,
          },
        },
      },
    });
  }

  async dtoValidationFunction(clientDto: any) {
    try {
      await AddClientSchema.validate(clientDto);
      return true;
    } catch (err) {
      await this.createErrorExcelSheet([{ error: err, dto: clientDto }]);
      return false;
    }
  }

  async createErrorExcelSheet(errorDto: any[]) {
    const headings = [
      'Error Errors',
      'Error Message',
      'Error Path',
      'User Type',
      'spoc name',
      'spoc email',
      'spoc ph number',
      'so Number',
      'po Number',
      'payment Terms',
      ' billingFaq',
      'so Received Date',
      'contract start date',
      'contract end date',
      'sales lead',
      'site address',
      'billing address',
      'branch Name',
    ];
    const data = [
      headings,
      ...errorDto.map((error) => [
        error.error.message,
        error.error.errors,
        error.error.path,
        error.dto.userType,
        error.dto.spoc[0]?.name,
        error.dto.spoc[0]?.email,
        error.dto.spoc[0]?.phoneNumber,
        error.dto.soNumber,
        error.dto.poNumber,
        error.dto.paymentTerms,
        error.dto.billingFaq,
        error.dto.soReceivedDate,
        error.dto.contractStartDate,
        error.dto.contractEndDate,
        error.dto.salesLead,
        error.dto.billingAddress,
        error.dto.branchName,
      ]),
    ];

    const worksheet = xlsx.utils.aoa_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a binary file
    xlsx.writeFile(workbook, 'Errordata.xlsx');
  }

  async createClientEntity(
    dto: CreateClientDto,
    clientTblData: any[],
    serviceDataDto: CreateServiceDto,
  ) {
    const response = await this.clientService.createClient(dto, serviceDataDto);
    if (!response['data']) return;
    const { client, branch, userId } = response.data;

    let clients1 = clientTblData.find((c:any) => c.id == client.id);
    if (clients1) {
      clients1.branches.push(branch)
      clientTblData.push(clients1)
    }else{
      const branches = this.branchRepository.create({
        id: branch.id,
        name: branch.name || dto?.branchName,
        city: branch.city,
      });
      const clients = this.clientsRepository.create({
        id: client.id,
        name: dto.name,
        industryType: dto.industryType,
        branches: [branches],
      });
      clientTblData.push(clients);
    }
    return clientTblData;
  }

  createClientDto(
    dto: CreateClientDto,
    client: Clients,
    cityId: number,
    rowData: any,
  ) {
    const branchName = rowData[client_const.BRANCH_NAME];
    const branchPresent = this.getBranchByCityIdAndBranchName(
      client?.branches,
      cityId,
      branchName,
    );
    const clientId = client?.id;

    const branchId = branchPresent?.id;
    if (!clientId) {
      dto.industryType = rowData[CLIENT_INFO.INDUSTRY_TYPE] || null;
      dto.name = rowData[CLIENT_INFO.CLIENT_NAME] || null;
      dto.clientType = rowData[CLIENT_INFO.CLIENT_TYPE] || null;
    }
  
    dto.userType = UserType.Client;
    dto.clientId = clientId;
    dto.branchId = branchId;
    dto.branchName = branchPresent?.name || branchName;
    dto.siteAddress =
      branchPresent?.siteAddress || rowData[CLIENT_INFO.SITE_ADDRESS];
    dto.billingAddress =
      branchPresent?.billingAddress || rowData[CLIENT_INFO.BILLING_ADDRESS];
    dto.city = cityId;
    dto.contractStartDate = rowData.contractStartDate;
    dto.contractEndDate = rowData.contractEndDate;
    dto.femaleCount = rowData.femaleCount;
    dto.salesLead = rowData.salesLead;
    dto.pincode = rowData.pincode;
    dto.gstNumber = rowData.gstNumber;
    dto.installationDate = rowData.completedAt;
    dto.Email = rowData.Email;
    dto.Password = rowData.Password;
    dto.completedAt = rowData.completedAt;
    dto.userName = rowData.Username;

    this.createContractObj(dto, clientId, branchId, rowData);
  }

  createContractObj(
    dto: CreateClientDto,
    clientId: number,
    branchId: number,
    rowData: any,
  ) {
    dto.clientId = clientId;
    dto.branchId = branchId;
    dto.requestType = rowData[CLIENT_INFO.REQUEST_TYPE];
    dto.contractStartDate = rowData?.contractStartDate;
    dto.contractEndDate = rowData?.contractEndDate;
    dto.soNumber = rowData?.soNumber;
    dto.poNumber = rowData?.poNumber;
    dto.paymentTerms = rowData?.paymentTerms;
    dto.soReceivedDate = rowData?.soReceivedDate;
    dto.billingFaq = rowData?.billingFaq;
    dto.femaleHygieneUnit = rowData?.femaleHygieneUnit;
    dto.vendingMachine = rowData?.vendingMachine;
    dto.simRecharge = rowData?.sim;
    dto.sanitaryPads = rowData?.sanitaryPads;
    dto.vmPads = rowData?.vendingMachinePads;
    dto.spoc = rowData?.spoc;
    dto.completedAt = rowData.completedAt
  }

  async groupDataByBranch(groupByBranch: any, client: any) {
    const newGroup = [];
    for (const branch in groupByBranch) {
      const groupBySO = await this.groupDataBySO(groupByBranch[branch], client);
      newGroup.push(groupBySO);
    }
    return newGroup[0];
  }

  async groupDataByClient(groupByClient: any[]) {
    const clientGroup = {};
    for (const product of groupByClient) {
      const clientName = product[CLIENT_INFO.CLIENT_NAME];
      if (clientName && !clientGroup[clientName]) {
        clientGroup[clientName] = [];
      }
      clientName && clientGroup[clientName].push(product);
    }
    return clientGroup;
  }

  getClientByClientName(clients: Clients[], clientName: string) {
    if (!clientName) return null;
    return this.getClientObj(clients, clientName);
    // return clients.find((c) => c.name == clientName);
  }

  /**
   * !Removed find and optimized
   */
  getClientObj(clients: Clients[], clientName: string) {
    const clientMap = {};
    clients.map((client) => {
      clientMap[client.name] = client;
    });
    return clientMap[clientName];
  }

  getCityIdByCityName(cities: any, cityName: string) {
    if (!cityName) return null;

    return cities[cityName];
  }

  createContractRequestDTO(
    clientId: number,
    branchId: number,
    cityId: number,
    rowData: any,
  ) {
    const dto = new BranchContractRequestDto();
    dto.clientId = clientId;
    dto.branchId = branchId;
    dto.city = cityId;
    dto.contractStartDate = rowData?.contractStartDate;
    dto.contractEndDate = rowData?.contractEndDate;
    dto.soNumber = rowData?.soNumber;
    dto.poNumber = rowData?.poNumber;
    dto.paymentTerms = rowData?.paymentTerms;
    dto.soReceivedDate = rowData?.soReceivedDate;
    dto.billingFaq = rowData?.billingFaq;
    dto.femaleHygieneUnit = rowData?.femaleHygieneUnit;
    dto.vendingMachine = rowData?.vendingMachine;
    dto.simRecharge = rowData?.sim;
    dto.sanitaryPads = rowData?.sanitaryPads;
    dto.vmPads = rowData?.vendingMachinePads;
    dto.spoc = rowData?.spoc;
    
    return dto;
  }

  createServiceDto(rowData: any) {
    const dto = new CreateServiceDto();
    dto.totalServiceCost = rowData?.totalServiceCost;
    dto.date = rowData.installationDate;
    dto.actualServiceDate = rowData.installationMonth;
    dto.status = ServiceStatus.COMPLETED;
    dto.stickers = rowData.stickers;
    dto.clientOnboardingProduct = rowData.clientOnboardingProduct;
    dto.serviceInvoiceAmount = rowData?.invoiceAmount;
    dto.vehicleUsed = rowData.vehicleUsed;
    dto.otherVehicleDetails = rowData?.otherVehicleDetails;
    dto.binMaintenancePart = rowData.binMaintenancePart;
    dto.otherBinMaintenancePart = rowData.otherBinMaintenancePart;
    dto.binMaintenancePartQty = rowData.binMaintenancePartQty;
    dto.completedAt = rowData.completedAt;
    
    return dto;
  }

  async getAllProductsIds() {
    const [femaleHygieneUnitIds, vendingMachineIds] = await Promise.all([
      await this.productService.getProducts('female_hygiene_unit'),
      await this.productService.getProducts('vending_machine'),
    ]);
    return { femaleHygieneUnitIds, vendingMachineIds };
  }

  getProductIdByName(productIds: any[], productName: string) {
    const product = productIds.find((i) => i.name == productName);
    return product?.id;
  }

  getBranchByCityIdAndBranchName(
    branch: Branch[],
    cityId: number,
    branchName: string,
  ) {
    if (!branch?.length) return null;
    const isBranchPresent = branch?.find(
      (i: Branch) => i?.city?.id == cityId && i?.name == branchName,
    );

    return isBranchPresent;
  }

  async readServicesSheetXlsx(filePath: string) {
    const data = fs.readFileSync(path.join(filePath));
    const workbook = xlsx.read(data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[2];
    const worksheet = workbook.Sheets[sheetName];
    const services: any = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
    });
    return services;
  }

  async createServices() {
    const xlsxFilePath = path.join(
      __dirname,
      '../',
      '../../../assets/Book1.xlsx',
    );
    const serviceSheetData = await this.readServicesSheetXlsx(xlsxFilePath);
    const [cities, clients] = await Promise.all([
      await this.uniqueCities(serviceSheetData),
      await this.getClients(serviceSheetData),
    ]);

    const service = await this.createMaintenanceServicesObj(
      serviceSheetData,
      cities,
      clients,
    );

    return serviceSheetData;
  }

  async createMaintenanceServicesObj(
    sheetData: any[],
    cities: any,
    clients: Clients[],
  ) {
    if (!sheetData?.length) return [];
    const serviceData: CreateMaintenanceServiceDto[] = [];
    const productIds = await this.getAllProductsIds();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    for (const row of sheetData) {
      this.createServiceProductEntityObj(
        row,
        productIds,
        clients,
        cities,
        serviceData,
      );
    }
    try {
      await this.service.createMaintenanceServices(serviceData, queryRunner);
      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log(
        'excel.services.ts :: createMaintenanceServicesObj ==>',
        error,
      );
      throw new BadRequestException(error?.message);
    } finally {
      await queryRunner.release();
    }

    return serviceData;
  }

  getBranchAndPurchase(branches: Branch[], cityId: number, rowData: any) {
    const branchName = rowData[SERVICES.BRANCH_NAME];
    const soNumber = rowData[SERVICES.SO_NUMBER];
    const branch: Branch = this.getBranchByCityIdAndBranchName(
      branches,
      cityId,
      branchName,
    );
    const purchase = this.getPurchase(branch?.purchase, soNumber);
    return { branch, purchase };
  }

  getPurchase(purchase: Purchase[], soNumber: string) {
    if (!purchase?.length) return;
    return purchase.find((i) => i.soNumber == soNumber);
  }

  createServiceEntityObj(
    row: any,
    clients: Clients[],
    cities: any,
    serviceDto: CreateMaintenanceServiceDto,
  ) {
    const service = new Services();
    const client = this.getClientByClientName(
      clients,
      row[SERVICES.CLIENT_NAME],
    );

    const cityId = cities[row[SERVICES.CITY]];
    // service.client = client;
    // service.city = cityId
    // service.branch = this.getBranchAndPurchase(client.branches,cityId,row).branch;
    // service.purchase = this.getBranchAndPurchase(client.branches,cityId,row).purchase;
    // service.date = row[SERVICES.SERVICE_DATE];
    // service.serviceAt = row[SERVICES.SERVICE_DATE];
    // service.serviceDate = row[SERVICES.SERVICE_DATE];
    // service.serviceDate = row[SERVICES.SERVICE_MONTH];
    // service.type = ServiceType.SERVICE;
    // service.rating = row[SERVICES.SERVICE_RATING];
    // service.status = ServiceStatus.COMPLETED;
    // service.totalServiceCost = row[SERVICES.TOTAL_SERVICE_COST];
    // service.vehicleUsed = row[SERVICES.VEHICLE_USED_FOR_SERVICE];
    // service.binMaintenanceParts = row[SERVICES.BIN_MAINTENANCE_PARTS]
    // service.binMaintenancePartQty = row[SERVICES.BIN_MAINTENANCE_PARTS_QTY] ? Number(row[SERVICES.BIN_MAINTENANCE_PARTS_QTY]) : null;
    // service.wastePadCollection = row[SERVICES.WASTED_PAD_COLLECTION_QTY];
    // service.completedAt = row[SERVICES.COMPLETED_ON]

    serviceDto.clientId = this.getClientByClientName(
      clients,
      row[SERVICES.CLIENT_NAME],
    )?.id;
    serviceDto.cityId = cityId;
    serviceDto.branchId = this.getBranchAndPurchase(
      client?.branches,
      cityId,
      row,
    )?.branch?.id;
    serviceDto.purchase = this.getBranchAndPurchase(
      client?.branches,
      cityId,
      row,
    )?.purchase;
    serviceDto.date = row[SERVICES.SERVICE_DATE];
    serviceDto.actualServiceDate = row[SERVICES.SERVICE_MONTH];
    serviceDto.type = ServiceType.SERVICE;
    serviceDto.rating = row[SERVICES.SERVICE_RATING];
    serviceDto.status = ServiceStatus.COMPLETED;
    serviceDto.totalServiceCost = row[SERVICES.TOTAL_SERVICE_COST];
    serviceDto.vehicleUsed = row[SERVICES.VEHICLE_USED_FOR_SERVICE];
    serviceDto.binMaintenancePart = row[SERVICES.BIN_MAINTENANCE_PARTS];
    serviceDto.binMaintenancePartQty = row[SERVICES.BIN_MAINTENANCE_PARTS_QTY]
      ? Number(row[SERVICES.BIN_MAINTENANCE_PARTS_QTY])
      : null;
    serviceDto.wastePadCollection = row?.[SERVICES.WASTED_PAD_COLLECTION_QTY] || 0;
    serviceDto.completedAt = row[SERVICES.COMPLETED_ON];
    // serviceDto. = row[SERVICES.SERVICE_DATE];
    return serviceDto;
  }

  createServiceProductEntityObj(
    row: any,
    productIds: any,
    clients: Clients[],
    cities: any,
    serviceData: any[],
  ) {
    this.createFhuServices(productIds, row, clients, cities, serviceData);
    this.createVendingMachineServices(
      productIds,
      row,
      clients,
      cities,
      serviceData,
    );
  }

  createFhuServices(
    productIds: any,
    row: any,
    clients: Clients[],
    cities: any,
    serviceData: any[],
  ) {
    const { femaleHygieneUnitIds } = productIds;
    const dto = new CreateMaintenanceServiceDto();
    const serviceDto = this.createServiceEntityObj(row, clients, cities, dto);

    if (
      row[SERVICES.TYPE_OF_BIN] &&
      row[SERVICES.BIN_SERVICE_TYPE] &&
      row[SERVICES.BIN_SERVICED_QTY] &&
      row[SERVICES.BIN_TOTAL_QTY]
    ) {
      const productId = this.getProductIdByName(
        femaleHygieneUnitIds,
        row[SERVICES.TYPE_OF_BIN],
      );
      const productDto = new CreateFemaleHygieneUnitDto();
      productDto.productId = productId;
      productDto.quantity = row[SERVICES.BIN_TOTAL_QTY];
      productDto.servicedQuantity = row[SERVICES.BIN_SERVICED_QTY];
      productDto.serviceCost = row[SERVICES.BIN_SERVICE_COST];
      productDto.totalServiceCost = row[SERVICES.TOTAL_SERVICE_COST];
      productDto.serviceType = row[SERVICES.BIN_SERVICE_TYPE];
      productDto.invoiceAmount = row[SERVICES.BIN_INVOICE_AMOUNT];
      productDto.invoiceNumber = row[SERVICES.BIN_INVOICE_NO];
      productDto.isInvoiceSubmitted = row[SERVICES.BIN_INVOICE_SUBMITTED];
      serviceDto.femaleHygieneUnit = [productDto];
      // console.log(dto);
      serviceData.push(dto);
    }
  }

  createVendingMachineServices(
    productIds: any,
    row: any,
    clients: Clients[],
    cities: any,
    serviceData: any[],
  ) {
    const { vendingMachineIds } = productIds;
    const dto = new CreateMaintenanceServiceDto();
    const serviceDto = this.createServiceEntityObj(row, clients, cities, dto);
    if (
      row[SERVICES.TYPE_OF_VM] &&
      row[SERVICES.VM_SERVICE_FREQUENCY] &&
      row[SERVICES.VM_SERVICED_QTY] &&
      row[SERVICES.VM_DEPLOYMENT_TYPE] == VM_SERVICE_TYPE.RENTAL &&
      row[SERVICES.VM_SERVICE_COST]
    ) {
      const productId = this.getProductIdByName(
        vendingMachineIds,
        row[SERVICES.TYPE_OF_VM],
      );
      const productDto = new CreateVendingMachineDto();
      productDto.productId = productId;
      productDto.servicedQuantity = row[SERVICES.VM_SERVICED_QTY];
      productDto.vmMaintenanceParts = row[SERVICES.VM_MAINTENANCE_PARTS];
      productDto.vmMaintenancePartQty = row[SERVICES.VM_MAINTENANCE_PARTS_QTY];
      productDto.invoiceAmount = row[SERVICES.VM_INVOICE_AMOUNT];
      productDto.serviceCost = row[SERVICES.VM_SERVICE_COST];
      productDto.invoiceNumber = row[SERVICES.VM_INVOICE_NO];
      productDto.rentalAmount = row[SERVICES.VM_RENTAL_AMOUNT];
      productDto.deploymentType = row[SERVICES.VM_DEPLOYMENT_TYPE];
      productDto.serviceType = row[SERVICES.VM_SERVICE_FREQUENCY];
      productDto.padRefillingQuantity5Rs = row[SERVICES.RS5_PAD_REFILLING_QTY];
      productDto.padRefillingQuantity10Rs =
        row[SERVICES.RS10_PAD_REFILLING_QTY];
      productDto.coinRefillingCollection5Rs =
        row[SERVICES.RS5_COIN_COLLECTION_QTY];
      productDto.coinRefillingCollection10Rs =
        row[SERVICES.RS10_COIN_COLLECTION_QTY];
      productDto.padSoldQuantity5Rs = row[SERVICES.RS5_PAD_SOLD_QTY];
      productDto.padSoldQuantity10Rs = row[SERVICES.RS10_PAD_SOLD_QTY];
      productDto.padSoldInvAmount = row[SERVICES.PAD_SOLD_INVOICE_AMOUNT];
      serviceDto.vendingMachine = [productDto];
      serviceData.push(dto);
    }
  }

  /**
   * !function for saving user credentials
   */
  async saveUserCredentials(userId: number, dto: CreateClientDto) {
    const setPasswordDto = new SetPasswordDto();
    setPasswordDto.id = userId;
    setPasswordDto.email = dto.Email;
    (setPasswordDto.password = dto.Password),
      (setPasswordDto.userName = dto.Email.split('@')[0]);

    return await this.userService.setClientUsernameAndPassword(setPasswordDto);
  }

  createClientEntityInstance(data: Partial<ICreateClientEntity>) {
    const client: Clients = plainToClass(Clients, {
      id: data.id,
      name: data.name,
      logo: data.logo,
      type: data.type,
      industryType: data.industryType,
      ifmClient: data.ifmClient || { id: data.ifmClientId },
      deletedAt: data.deletedAt,
    });

    return this.clientsRepository.create(client);
  }

  async createUserEntityInstance(data: Partial<ISaveUserCredentials>) {
    const hashedPassword = await this.cryptoService.generatePassword(
      data.password,
    );

    // console.log(hashedPassword);

    const user: User = plainToClass(User, {
      id: data.id,
      name: data.name,
      userName: data.userName || data.email.split('@')[0],
      email: data.email,
      password: hashedPassword,
      userType: data.userType,
      client: data.client || { id: data.clientId },
      branch: data.branch || { id: data.branchId },
      // employeeProfile: data.employeeProfile || {id:data.employeeProfileId},
      assignees: data.assignees || { id: data.assigneeId },
    });
    // console.log(user);

    return this.usersRepository.create(user);
  }
}
