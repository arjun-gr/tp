import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Not, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Collaterals } from '../../entities/collaterals.entity';
import { COLLATERALS_REPOSITORY } from '../database/database.providers';
import { CollateralsResponseCodes } from './collaterals.response.code';
import { CreateCollateralsDto } from './dto/create-collaterals.dto';
import { UpdateCollateralsDto } from './dto/update-collaterals.dto';

@Injectable()
export class CollateralsService {
  constructor(
    @Inject(COLLATERALS_REPOSITORY)
    private collateralsRepository: Repository<Collaterals>,
  ) {}

  async createCollaterals(dto: CreateCollateralsDto, userId: any) {
    if (dto.isFeature) await this.removeFeatureCollateralIfAlreadyPresent();
    const collaterals = plainToClass(Collaterals, {
      collateralFile: dto.collateralFile,
      title: dto.title,
      isFeature: dto.isFeature,
      publishedAt: dto.published ? new Date() : null,
      publishedBy: dto.published ? userId : null,
    });
    return await this.collateralsRepository.save(collaterals);
  }

  async getAllCollateralsByPagination(pageOptionsDto: PageOptionsDto) {
    const search = pageOptionsDto?.search;
    let where: any = [];
    if (search && search.trim().length > 0) {
      where.push({
        isActive: true,
        title: ILike(`%${search}%`),
      });
    } else {
      where = { isActive: true };
    }
    const [list, count] = await this.collateralsRepository.findAndCount({
      where,
      relations: {
        collateralFile: true,
      },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });

    return new PageDto(list, pageMetaDto);
  }

  async remove(id: number) {
    await this.throwIfCollateralsNotExists(id);
    await this.collateralsRepository.update(id, { isActive: false });
    return this.collateralsRepository.softDelete(id);
  }

  async updateCollateral(id: number, dto: UpdateCollateralsDto, userId: any) {
    await this.throwIfCollateralsNotExists(id);
    if (dto.isFeature) await this.removeFeatureCollateralIfAlreadyPresent(id);
    await this.collateralsRepository.update(id, {
      // ...dto,
      collateralFile: dto.collateralFile,
      title: dto.title,
      isFeature: dto.isFeature,
      publishedAt: dto.published ? new Date() : null,
      publishedBy: dto.published ? userId : null,
    });
    return {
      message: 'Collateral updated successfully',
      id,
      collateralFile: dto.collateralFile,
    };
  }

  private async throwIfCollateralsNotExists(id: number) {
    const collaterals = await this.collateralsRepository.findOne({
      where: { id, isActive: true },
      relations: {
        collateralFile: true,
      },
    });
    if (!collaterals) {
      throw CollateralsResponseCodes.COLLATERALS_NOT_EXISTS;
    }
    return collaterals;
  }

  async removeFeatureCollateralIfAlreadyPresent(id?: number) {
    if (!id) {
      await this.collateralsRepository.update(
        {},
        {
          isFeature: false,
        },
      );
    } else {
      await this.collateralsRepository.update(
        { id: Not(id) },
        {
          isFeature: false,
        },
      );
    }
  }

  findone(id: number) {
    return this.throwIfCollateralsNotExists(id);
  }
}
