import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CityResponseCodes } from './city.response.code';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/request/create-city.dto';
import { UpdateCityDto } from './dto/request/update-city.dto';

@Controller('city')
@ApiTags('City')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @ApiResponse(CityResponseCodes.CREATED)
  @ApiResponse(CityResponseCodes.BAD_REQUEST)
  @ApiResponse(CityResponseCodes.CITY_EXISTS)
  @HttpCode(201)
  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get('/without-operation-manager')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async cityListWithNoOpsManager() {
    return this.cityService.cityListWithNoOperationManger();
  }

  @Get('/with-operation-manager')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async findAll() {
    return this.cityService.cityListWithOperationManger();
  }

  @Get('/city-list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async getAllCities(@AuthUser() user: User) {
    return this.cityService.getCitiesList(user);
  }

  // @Get('')
  // async getCities(@Query() pageOptionsDto: PageOptionsDto) {
  //   return this.cityService.getCities(pageOptionsDto);
  // }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  async getCities(@Query() pageOptionsDto: PageOptionsDto) {
    return this.cityService.getCities(pageOptionsDto);
  }

  @Get('/download')
  async download(@Res() _res: Response) {
    // const _cities: City[] = await this.cityService.findAll();
    // const columns = [
    //   // { id: 'id' },
    //   // { name: 'name' },
    //   // { tier: 'tier' },
    //   'id',
    //   'name',
    //   'tier',
    //   // 'franchise',
    //   // 'divisions',
    //   // 'noOfClients',
    //   // 'cityOpsManagerId',
    // ];
    // const data = _cities.map((c: City) => {
    //   return {
    //     id: c.id,
    //     name: c.name,
    //     tier: c.tier,
    //   };
    // });

    // const csv = await generateCSV(
    //   data,
    //   columns,
    //   `city-${new Date().getTime()}`,
    // );
    // _res.status(HttpStatus.OK).download(csv);
    return 'download';
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.cityService.findById(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
