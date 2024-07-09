import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Country } from '../../entities/country.entity';
import { CountryResponseCodes } from './country.response.codes';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @Inject('COUNTRY_REPOSITORY')
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      const country: Country = plainToClass(Country, createCountryDto);
      await this.countryRepository.save(country);
      return country;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw CountryResponseCodes.EXITS;
      } else {
        throw CountryResponseCodes.BAD_REQUEST;
      }
    }
  }

  findAll(): Promise<Country[]> {
    return this.countryRepository.find({ where: { isActive: true } });
  }

  findById(id: number): Promise<Country> {
    return this.countryRepository.findOne({ where: { id, isActive: true } });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findById(id);
    if (!country) throw new NotFoundException('Country not Found!');
    return this.countryRepository.update(id, updateCountryDto);
  }

  async remove(id: number) {
    const country = await this.findById(id);
    if (!country) throw new NotFoundException('Country not Found!');
    return this.countryRepository.softDelete(id);
  }
}
