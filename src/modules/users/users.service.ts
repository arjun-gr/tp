import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { ILike, In, Not, Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { EmployeeType, EmployeeTypes } from '../../common/enums/employee-type';
import { UserType } from '../../common/enums/user-type';
import { Branch } from '../../entities/branch.entity';
import { City } from '../../entities/city.entity';
import { Clients } from '../../entities/clients.entity';
import { EmployeeProfile } from '../../entities/employee.entity';
import { UserAssignee } from '../../entities/user-assignees.entity';
import { UserCity } from '../../entities/user-city.entity';
import { User } from '../../entities/user.entity';
import {
  getEmployeeProfileColumns,
  getRolesColumn,
  getcityColumns,
} from '../../helpers/getcolumns.helper';
import { CryptoService } from '../../providers/crypto.service';
import { checkValueExists } from '../../utils/app.utils';
import { AwarenessCampResponseCodes } from '../awareness_camp/awareness-camp.response.code';
import { CityService } from '../city/city.service';
import { clientListRes } from '../client/client-response.helpter';
import {
  BRANCH_REPOSITORY,
  CLIENT_REPOSITORY,
  EMPLOYEE_PROFILE_REPOSITORY,
  USER_CITY_REPOSITORY,
  USER_EXECUTIVE_REPOSITORY,
  USER_REPOSITORY,
} from '../database/database.providers';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseCodes } from './user.response.codes';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    @Inject(EMPLOYEE_PROFILE_REPOSITORY)
    private employeeRepository: Repository<EmployeeProfile>,
    private cryptoService: CryptoService,
    @Inject(CLIENT_REPOSITORY)
    private clientRepository: Repository<Clients>,
    @Inject(BRANCH_REPOSITORY)
    private branchRepository: Repository<Branch>,
    @Inject(USER_EXECUTIVE_REPOSITORY)
    private userAssigneeRepository: Repository<UserAssignee>,
    @Inject(USER_CITY_REPOSITORY)
    private userCityRepository: Repository<UserCity>,
    @Inject(forwardRef(() => CityService))
    private readonly cityService: CityService,
  ) {}

  async throwIfUserNameExists(userName: string): Promise<boolean> {
    if (!userName) return false;
    const user: User = await this.findByUserName(userName);
    if (user != null) {
      throw UserResponseCodes.USER_NAME_ID_EXISTS;
    }
    return false;
  }

  async createEmployee(createUserDto: CreateUserDto) {
    await this.throwIfUserNameExists(createUserDto.userName);
    const city = await this.cityService.throwIfCityIdNotExists(
      createUserDto.cityId,
    );
    const user: User = plainToClass(User, {
      ...createUserDto,
      userType: UserType.Employee,
    });
    user.cities = [city];
    if (user.userName && user.password) {
      user.password = await this.cryptoService.generatePassword(user.password);
    }
    const createdUser = await this.userRepository.save(user);
    if (createdUser.id) {
      const employee = new EmployeeProfile();
      employee.phoneNumber = createUserDto.phoneNumber;
      employee.designation = createUserDto.designation;
      // employee.division = createUserDto.division;
      // employee.jobType = createUserDto.jobType;
      employee.type = createUserDto.type;
      employee.user = createdUser;
      await this.employeeRepository.save(employee);
      createdUser.employeeProfile = employee;
      await this.userRepository.save(createdUser);
      if (createUserDto.assigneeId) {
        const manager: User = await this.userRepository.findOne({
          where: { id: createUserDto.assigneeId, isActive: true },
        });
        manager.assignees = [createdUser];
        await this.userRepository.save(manager);
      }
    }
    return { message: 'Employee create successfully' };
  }

  findAll() {
    return this.userRepository.find({
      where: { isActive: true },
      relations: {
        cities: true,
        employeeProfile: true,
        assignees: true,
        roles: true,
      },
      select: {
        cities: getcityColumns(),
        roles: getRolesColumn(),
        employeeProfile: getEmployeeProfileColumns(),
        assignees: {},
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
  }

  async getEmployeeByUserId(userId: number) {
    const emp: any = await this.userRepository.findOne({
      where: {
        id: userId,
        // isActive: true,
      },
      relations: {
        cities: { users: { employeeProfile: true } },
        employeeProfile: true,
        assignees: true,
      },
      select: {
        cities: {
          id: true,
          name: true,
          tier: true,
          franchise: true,
          noOfClients: true,
        },
        employeeProfile: {
          id: true,
          phoneNumber: true,
          designation: true,
          type: true,
        },
        assignees: {
          id: true,
          name: true,
        },
        isActive: true,
        id: true,
        name: true,
        userType: true,
        email: true,
      },
    });
    emp.opsManager = emp?.cities[0]?.users?.filter(
      (user: any) =>
        user?.employeeProfile?.type == EmployeeType.CITY_OPS_MANAGER,
    );

    return emp;
  }

  async findByUserName(userName: string): Promise<User> {
    return this.userRepository.findOne({
      where: { userName },
    });
  }

  findById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  private async getUserByIdOrThrow(userId: number): Promise<User> {
    const user: User = await this.findById(userId);
    if (user == null) {
      throw UserResponseCodes.INVALID_USER_ID;
    }
    return user;
  }
  async toggleUserActive(userId: number, status: boolean) {
    await this.userRepository.update({ id: userId }, { isActive: status });
    return {
      statusCode: 200,
      message: 'user status update successfully',
    };
  }

  async updateEmployee(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.type) this.checkEmployeeTypeValue(updateUserDto.type);
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: { employeeProfile: true, cities: true },
    });
    if (!user) throw new NotFoundException('User not Found!');

    delete updateUserDto.password;
    const employee = new EmployeeProfile();
    employee.type = updateUserDto.type;
    employee.phoneNumber = updateUserDto.phoneNumber;
    employee.designation = updateUserDto.designation;
    await this.employeeRepository.update(
      { id: user?.employeeProfile?.id },
      employee,
    );

    const newUser = new User();
    newUser.name = updateUserDto.name;
    newUser.email = updateUserDto.email;
    newUser.userName = updateUserDto.userName;
    await this.userRepository.update(id, newUser);
    if (updateUserDto.assigneeId) {
      await this.updateCityOperationManager(updateUserDto.assigneeId, user);
    }
    if (updateUserDto.cityId) {
      await this.removeUserCitiesIfExists(user.id, updateUserDto.cityId);
    }
    return {
      message: 'Employee updated successfully',
      data: {
        userId: user.id,
        employeeProfileId: user?.employeeProfile?.id,
      },
    };
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not Found!');
    return this.userRepository.softDelete(id);
  }

  async deleteEmployee(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          employeeProfile: true,
        },
      });
      if (!user) throw new NotFoundException('employee Not Found');
      await this.employeeRepository.softDelete(user.employeeProfile.id);
      await this.employeeRepository.update(
        { id: user.employeeProfile.id },
        { isActive: false },
      );
      await this.userRepository.softDelete(user.id);
      await this.userRepository.update({ id: user.id }, { isActive: false });
      return {
        message: 'Employee delete successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @OnEvent(Events.CITY_CREATED)
  async cityOpsManagerAdded(event: { data: { user_id: number; city: City } }) {
    const {
      data: { user_id, city },
    } = event;
    if (!user_id && !city) return;
    await this.removeAllCityManagers(city.id);
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: {
        cities: true,
      },
    });
    if (!user) throw new NotFoundException('User not Found!');
    user.cities = [...user.cities, city];
    await this.userRepository.save(user);
  }

  async getCityManagerList(cityId: number) {
    const users = await this.userRepository.find({
      where: {
        isActive: true,
        userType: UserType.Employee,
        employeeProfile: { type: EmployeeType.CITY_OPS_MANAGER },
        cities: { id: cityId },
      },
      // relations: {
      //   cities: true,
      //   employeeProfile: true,
      // },
      relations: ['cities', 'employeeProfile'],
      select: {
        id: true,
        name: true,
        cities: {
          id: true,
        },
        employeeProfile: {},
      },
    });
    return users;
  }

  async getCityManagers(user: User) {
    if (user.userType == UserType.Employee) {
      return [user];
    }
    if (user.userType == UserType.Client) {
      return user.branch.city.users.filter(
        (user) =>
          user?.employeeProfile?.type == EmployeeType.CITY_OPS_MANAGER &&
          user.isActive == true,
      );
    }
    const users = await this.userRepository.find({
      where: {
        isActive: true,
        userType: UserType.Employee,
        employeeProfile: { type: EmployeeType.CITY_OPS_MANAGER },
      },
      relations: {
        cities: true,
        employeeProfile: true,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        userType: true,
        cities: {
          id: true,
        },
        employeeProfile: {
          type: true,
        },
      },
    });
    // return users.filter((user) => user.cities.length === 0);
    return users;
  }

  async getEmployees(
    pageOptionsDto: PageOptionsDto,
    userType?: string,
    status?: boolean,
    cityId?: number,
  ) {
    const search = pageOptionsDto?.search;
    let where: any = search?.length
      ? [
          {
            isActive: status,
            userType: UserType.Employee,
            cities: { id: cityId },
            employeeProfile: { type: userType },
            name: ILike(`%${search}%`),
          },
          {
            isActive: status,
            userType: UserType.Employee,
            cities: { id: cityId, name: ILike(`%${search}%`) },
            employeeProfile: { type: userType },
          },
          {
            isActive: status,
            userType: UserType.Employee,
            cities: { id: cityId },
            employeeProfile: { type: userType },
            email: ILike(`%${search}%`),
          },
        ]
      : {
          isActive: status,
          cities: { id: cityId },
          userType: UserType.Employee,
          employeeProfile: { type: userType },
        };

    if (where.length) {
      where.forEach(function (v) {
        if (!userType) delete v.employeeProfile;
        if (!cityId) delete v.cities.id;
        if (status == undefined) delete v.isActive;
      });
    } else {
      if (!userType) delete where.employeeProfile;
      if (!cityId) delete where.cities.id;
      if (status == undefined) delete where.isActive;
    }

    const [list, count] = await this.userRepository.findAndCount({
      where: where,
      withDeleted: true,
      relations: {
        cities: true,
        employeeProfile: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userType: true,
        isActive: true,
        cities: {
          id: true,
          name: true,
        },
      },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(list, pageMetaDto);
  }

  getClientById(userId: number) {
    return this.userRepository.findOne({
      where: {
        client: { id: userId },
        userType: UserType.Client,
        isActive: true,
      },
    });
  }

  async setClientUsernameAndPassword(userDetails: SetPasswordDto) {
    await this.throwIfUserNotExists(userDetails.id);
    const userExists = await this.checkUserNameAndEmailPresent(
      userDetails.id,
      userDetails.userName,
      userDetails.email,
    );
    if (userExists) {
      // throw new NotAcceptableException('username or email already exists.');
      return "User exists"
      
    }
    const user = new User();
    if (userDetails.userName && userDetails.password) {
      user.password = await this.cryptoService.generatePassword(
        userDetails.password,
      );
    }
    user.userName = userDetails.userName;
    user.email = userDetails.email;
    // const createdUser = await this.userRepository.update(userDetails.id, user);
    const createdUser = await this.userRepository.update(userDetails.id, user);

    return {
      message: 'username and password set successfully',
      createdUser,
    };
  }

  async getClientsList(search: string) {
    let where = {
      user: { userType: UserType.Client, isActive: true },
      client: {
        name: ILike(`%${search}%`),
        isActive: true,
      },
    };
    if (!search) {
      delete where.client.name;
    }
    const client = await this.branchRepository.find({
      where: where,
      relations: { client: true },
    });
    return clientListRes(client);
  }

  async getBranchList(clientId: number) {
    let client = await this.throwIfClientNotExists(clientId);
    let where = {
      user: { userType: UserType.Client, isActive: true },
      client: {
        id: client.id,
        isActive: true,
      },
    };
    return this.branchRepository.find({
      where: where,
      select: {
        id: true,
        name: true,
        client: { id: true },
        user: { id: true },
      },
      relations: {
        client: true,
        user: true,
      },
    });
  }

  async getCityOpManagerDetailsByCity(userId: number, cityId: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cities', 'cities')
      .where('user.id=:userId and cities.id=:cityId', { userId, cityId })
      .select([
        'user.id',
        'user.name',
        'user.isActive',
        'cities.id',
        'cities.name',
      ])
      .getOne();

    if (!user) throw AwarenessCampResponseCodes.CLIENT_NOT_EXISTS;
    let client: any = await this.branchRepository.find({
      where: { city: { id: cityId } },
      relations: {
        client: true,
      },
    });
    client = Array.from(new Set(client.map((s) => s.client.id))).map((id) => {
      return client.find((s) => s.client.id == id).client.name;
    });
    return {
      name: user.name,
      isActive: user.isActive,
      city: user.cities[0].name,
      clients: client.toString(),
    };
  }

  async throwIfUserNotExists(id: number) {
    let user = await this.userRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    if (!user) throw UserResponseCodes.USER_NOT_EXISTS;
    return user;
  }

  async throwIfClientNotExists(id: number) {
    let client = await this.clientRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!client) throw AwarenessCampResponseCodes.CLIENT_NOT_EXISTS;
    return client;
  }

  private checkEmployeeTypeValue(empType: string) {
    const result: any = checkValueExists(EmployeeTypes, empType);
    if (!result) throw UserResponseCodes.INVALID_USER_EMPLOYEE_TYPE;
    return true;
  }

  /**
   * @description update city operation manager of city executive or service support executive
   * @param managerId
   * @param userId
   */
  async updateCityOperationManager(managerId: number, user: User) {
    await this.removeOperationManagerIfExist(managerId, user?.id);
    const manager: User = await this.userRepository.findOne({
      where: { id: managerId, isActive: true },
    });

    manager.assignees = [user];
    await this.userRepository.save(manager);
  }

  /**
   * @description delete operation manager if current managerId is different.
   * @param managerId
   * @param executiveId
   */
  async removeOperationManagerIfExist(managerId: number, executiveId: number) {
    const manager = await this.userAssigneeRepository.findOne({
      where: { executiveId: executiveId },
    });
    if (manager?.cityManagerId == managerId) return;
    await this.userAssigneeRepository.delete({ executiveId: executiveId });
  }

  // async updateUserCity(userId: number, cityId: number) {
  //   await this.removeUserCitiesIfExists(userId, cityId);
  //   const city = await this.cityService.throwIfCityIdNotExists(cityId);
  // }

  async removeUserCitiesIfExists(userId: number, cityId: number) {
    const cityExists = await this.userCityRepository.findOne({
      where: {
        userId,
      },
    });
    if (cityExists?.cityId == cityId) return;
    await this.userCityRepository.delete({ userId: userId });
    const userCity = new UserCity();
    userCity.userId = userId;
    userCity.cityId = cityId;
    this.userCityRepository.save(userCity);
  }

  findOne(userId: number) {
    const user = this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not Found');
    return user;
  }

  async checkUserNameAndEmailPresent(
    userId: number,
    username: string,
    email: string,
  ) {
    const user = this.userRepository.findOne({
      where: [
        {
          userName: username,
          id: Not(userId),
        },
        {
          email: email,
          id: Not(userId),
        },
      ],
    });
    return user;
  }

  async removeAllCityManagers(cityId: number) {
    const cityManagers = await this.getCityManagerList(cityId);
    const userIds = cityManagers?.map((i) => i.id);
    if (userIds.length) {
      await this.userCityRepository.delete({ userId: In(userIds), cityId });
    }
  }

  async getUserByIds(userId: number | number[]) {
    let where: any = {};
    if (typeof userId == 'number') {
      where['id'] = userId;
    }
    if (Array.isArray(userId)) {
      where['id'] = In(userId);
    }
    return this.userRepository.find({
      where,
    });
  }

  async getSuperAdminIds() {
    return this.userRepository.find({
      where: {
        userType: UserType.SUPER_ADMIN,
      },
    });
  }
}
