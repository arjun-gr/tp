import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { Events } from '../../common/constants/events.constants';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { EmployeeType } from '../../common/enums/employee-type';
import { UserType } from '../../common/enums/user-type';
import { City } from '../../entities/city.entity';
import { User } from '../../entities/user.entity';
import { CITY_REPOSITORY } from '../database/database.providers';
import { UsersService } from '../users/users.service';
import { cityResponse } from './city.helper';
import { CityResponseCodes } from './city.response.code';
import { CreateCityDto } from './dto/request/create-city.dto';
import { UpdateCityDto } from './dto/request/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    @Inject(CITY_REPOSITORY)
    private cityRepository: Repository<City>,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  
  async create(createCityDto: CreateCityDto) {
    await this.throwIfCityNameExists(createCityDto.name);
    console.log("create method of city is called")
    console.log(createCityDto)
    const city: City = plainToClass(City, createCityDto);
    const obj: City = await this.cityRepository.save(city);
    if (createCityDto.cityOpsManager) {
      this.eventEmitter.emit(Events.CITY_CREATED, {
        data: {
          user_id: createCityDto.cityOpsManager,
          city,
        },
      });
    } else {
      this.userService.removeAllCityManagers(city.id);
    }
    delete createCityDto.cityOpsManager;
    return obj;
  }

  async createDbExcelEntry(createCityDto: CreateCityDto){
    console.log("create method of city is called")
    console.log(createCityDto)
    const city: City = plainToClass(City, createCityDto);
    const obj: City = await this.cityRepository.save(city);
    return obj;
  }

  async cityListWithNoOperationManger() {
    const cities = await this.cityRepository.find({
      where: {
        isActive: true,
      },
      relations: ['users'],
      select: {
        id: true,
        name: true,
      },
    });

    return cities.filter((city) => city.users?.length == 0);
  }

  cityListWithOperationManger() {
    return this.cityRepository.find({
      where: {
        isActive: true,
        users: {
          userType: UserType.Employee,
          employeeProfile: { type: EmployeeType.CITY_OPS_MANAGER },
        },
      },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        users: {},
      },
    });
  }

  async findById(id: number) {
    const city = await this.cityRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      select: {
        state: { id: true, name: true },
        users: { id: true, name: true },
      },
      relations: { state: true, users: { employeeProfile: true } },
    });
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findById(id);
    if (!city) throw CityResponseCodes.CITY_NOT_EXISTS;
    if (updateCityDto.cityOpsManager) {
      this.eventEmitter.emit(Events.CITY_CREATED, {
        data: {
          user_id: updateCityDto.cityOpsManager,
          city,
        },
      });
      delete updateCityDto.cityOpsManager;
      if (Object.keys(updateCityDto).length == 1) return true;
    } else {
      this.userService.removeAllCityManagers(id);
      delete updateCityDto.cityOpsManager;
    }
    return this.cityRepository.update(id, updateCityDto);
  }

  async remove(id: number) {
    const city = await this.findById(id);
    if (!city) throw CityResponseCodes.CITY_NOT_EXISTS;
    await this.cityRepository.update(id, { machineName: null });
    return this.cityRepository.softDelete(id);
  }

  async getCities(pageOptionsDto: PageOptionsDto) {
    const search = pageOptionsDto?.search;
    let where: any = {
      name: ILike(`%${search}%`),
      isActive: true,
    };
    if (!search?.length) delete where.name;
    const [list, count] = await this.cityRepository.findAndCount({
      select: {
        users: { id: true, name: true, employeeProfile: { type: true } },
      },
      relations: {
        users: { employeeProfile: true },
      },
      where: where,
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(cityResponse(list), pageMetaDto);
  }

  private async throwIfCityNameExists(name: string): Promise<boolean> {
    const city: City = await this.cityRepository.findOne({ where: { name } });
    if (city != null) {
      throw CityResponseCodes.CITY_EXISTS;
    }
    return false;
  }

  async throwIfCityIdNotExists(id: number) {
    const city: City = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw CityResponseCodes.CITY_NOT_EXISTS;
    }
    return city;
  }

  async getCitiesList(user: User) {
    if (user.userType == UserType.Employee) {
      return user?.cities?.map((city) => ({ id: city.id, name: city.name }));
    } else if (user.userType == UserType.Client) {
      const cities = await this.cityRepository.find({
        where: {
          isActive: true,
          branches: {
            client: { id: user.client.id },
          },
        },
        select: { id: true, name: true },
      });
      return cities;
    } else {
      return this.cityRepository.find({
        where: { isActive: true },
        select: { id: true, name: true },
      });
    }
  }

  @OnEvent(Events.CLIENT_ADDED)
  async cityOpsManagerAdded(event: { data: { cityId: number } }) {
    const {
      data: { cityId },
    } = event;
    const city = await this.cityRepository.findOne({
      where: {
        id: cityId,
      },
    });
    if (!city) throw CityResponseCodes.CITY_NOT_EXISTS;
    const clientCount = city.noOfClients + 1;
    await this.cityRepository.update(
      { id: cityId },
      { noOfClients: clientCount },
    );
  }

  async createCities(createCityDto: CreateCityDto) {
    await this.throwIfCityNameExists(createCityDto.name);
    const city: City = plainToClass(City, createCityDto);
    const obj: City = await this.cityRepository.save(city);
    return obj;
  }

}
