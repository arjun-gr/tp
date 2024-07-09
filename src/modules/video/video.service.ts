import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Not, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Video } from '../../entities/video.entity';
import { VIDEO_REPOSITORY } from '../database/database.providers';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseCodes } from './video.response.codes';

@Injectable()
export class VideoService {
  constructor(
    @Inject(VIDEO_REPOSITORY)
    private videoRepository: Repository<Video>,
  ) {}

  async createVideo(dto: CreateVideoDto, userId: number) {
    if (dto.isFeature) await this.removeFeatureVideoIfAlreadyPresent();
    const video = plainToClass(Video, {
      // ...dto,
      video: dto.videoId,
      title: dto.title,
      thumbnail: dto.thumbnailId,
      description: dto.description,
      isFeature: dto.isFeature,
      publishedAt: dto.published ? new Date() : null,
      publishedBy: dto.published ? userId : null,
    });
    return await this.videoRepository.save(video);
  }

  async getAllVideoByPagination(pageOptionsDto: PageOptionsDto) {
    const search = pageOptionsDto?.search;

    const [list, count] = await this.videoRepository.findAndCount({
      where: {
        isActive: true,
        title:
          search && search.trim().length > 0
            ? ILike(`%${search}%`)
            : ILike(`%%`),
      },
      relations: {
        video: true,
        thumbnail: true,
      },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });

    return new PageDto(list, pageMetaDto);
  }

  async remove(id: number) {
    const video = await this.throwIfVideoNotExists(id);
    await this.videoRepository.update(id, { isActive: false });
    return this.videoRepository.softDelete(id);
  }

  async getVideoById(videoId: number) {
    const video = await this.throwIfVideoNotExists(videoId);
    return video;
  }

  async updateVideo(id: number, dto: UpdateVideoDto, userId: any) {
    await this.throwIfVideoNotExists(id);
    if (dto.isFeature) await this.removeFeatureVideoIfAlreadyPresent(id);
    await this.videoRepository.update(id, {
      // ...dto,
      video: dto.videoId,
      title: dto.title,
      thumbnail: dto.thumbnailId,
      description: dto.description,
      isFeature: dto.isFeature,
      publishedAt: dto.published ? new Date() : null,
      publishedBy: dto.published ? userId : null,
    });
    return { message: 'Video updated successfully' };
  }

  private async throwIfVideoNotExists(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id, isActive: true },
      relations: {
        video: true,
        thumbnail: true,
      },
    });
    if (!video) {
      throw VideoResponseCodes.VIDEO_NOT_EXISTS;
    }
    return video;
  }

  async removeFeatureVideoIfAlreadyPresent(id?: number) {
    if (!id) {
      await this.videoRepository.update(
        {},
        {
          isFeature: false,
        },
      );
    } else {
      await this.videoRepository.update(
        { id: Not(id) },
        {
          isFeature: false,
        },
      );
    }
  }
}
