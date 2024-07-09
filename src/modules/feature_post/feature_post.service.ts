import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ILike, Not, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Blog } from '../../entities/blog.entity';
import { Collaterals } from '../../entities/collaterals.entity';
import { FeaturePost } from '../../entities/feature-post.entity';
import { Video } from '../../entities/video.entity';
import {
  BLOG_REPOSITORY,
  COLLATERALS_REPOSITORY,
  FEATURE_POST_REPOSITORY,
  VIDEO_REPOSITORY,
} from '../database/database.providers';
import { CreateFeaturePostDto } from './dto/create-feature_post.dto';
import { UpdateFeaturePostDto } from './dto/update-feature_post.dto';

@Injectable()
export class FeaturePostService {
  constructor(
    @Inject(FEATURE_POST_REPOSITORY)
    private featurePostRepository: Repository<FeaturePost>,
    @Inject(BLOG_REPOSITORY)
    private blogRepository: Repository<Blog>,
    @Inject(COLLATERALS_REPOSITORY)
    private collateralsRepository: Repository<Collaterals>,
    @Inject(VIDEO_REPOSITORY)
    private videoRepository: Repository<Video>,
  ) {}

  async create(createFeaturePostDto: CreateFeaturePostDto, userId: number) {
    await this.removeFeaturePostIfAlreadyPresent();
    const featurePost = plainToClass(FeaturePost, {
      ...createFeaturePostDto,
      thumbnail: createFeaturePostDto.thumbnailId,
      title: createFeaturePostDto.title,
      link: createFeaturePostDto.link,
      isFeature: createFeaturePostDto.isFeature,
      publishedAt: createFeaturePostDto.published ? new Date() : null,
      publishedBy: createFeaturePostDto.published ? userId : null,
    });
    return this.featurePostRepository.save(featurePost);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const search = pageOptionsDto?.search;
    const [list, count] = await this.featurePostRepository.findAndCount({
      where: {
        isActive: true,
        title:
          search && search.trim().length > 0
            ? ILike(`%${search}%`)
            : ILike(`%%`),
      },
      relations: { thumbnail: true },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });

    return new PageDto(list, pageMetaDto);
  }

  findOne(id: number) {
    return this.throwIfFeaturePostNotExists(id);
  }

  async update(
    id: number,
    updateFeaturePostDto: UpdateFeaturePostDto,
    userId: any,
  ) {
    await this.throwIfFeaturePostNotExists(id);
    await this.removeFeaturePostIfAlreadyPresent(id);
    await this.featurePostRepository.update(id, {
      thumbnail: updateFeaturePostDto.thumbnailId,
      title: updateFeaturePostDto.title,
      link: updateFeaturePostDto.link,
      isFeature: updateFeaturePostDto.isFeature,
      publishedAt: updateFeaturePostDto.published ? new Date() : null,
      publishedBy: updateFeaturePostDto.published ? userId : null,
    });
    return { message: 'Post updated successfully' };
  }

  async remove(id: number) {
    await this.featurePostRepository.update(id, { isActive: false });
    return this.featurePostRepository.softDelete(id);
  }

  private async throwIfFeaturePostNotExists(id: number): Promise<any> {
    const featurePost: FeaturePost = await this.featurePostRepository.findOne({
      where: { isActive: true, id },
      relations: { thumbnail: true },
    });
    if (!featurePost) {
      throw 'Feature Post Not Exists';
    }
    return featurePost;
  }

  async getAllFeaturedBlog() {
    let where = {
      isActive: true,
      isFeature: true,
    };
    const blog = await this.blogRepository.find({
      where: where,
      relations: {
        heroImage: true,
        teaserImage: true,
      },
    });
    return blog?.length ? blog : [];
  }

  async getAllFeaturedCollateral() {
    let where = {
      isActive: true,
      isFeature: true,
    };
    let collaterals = await this.collateralsRepository.find({
      where: where,
      relations: {
        collateralFile: true,
      },
    });
    return collaterals?.length ? collaterals : [];
  }

  async getAllFeaturedVideos() {
    let where = {
      isActive: true,
      isFeature: true,
    };
    let videos = await this.videoRepository.find({
      where: where,
      relations: {
        video: true,
        thumbnail: true,
      },
    });
    return videos?.length ? videos : [];
  }

  async getAllFeaturePost() {
    const [blog, video, collateral] = await Promise.all([
      this.getAllFeaturedBlog(),
      this.getAllFeaturedCollateral(),
      this.getAllFeaturedVideos(),
    ]);
    return [...blog, ...video, ...collateral];
  }

  async removeFeaturePostIfAlreadyPresent(id?: number) {
    if (!id) {
      await this.featurePostRepository.update(
        {},
        {
          isFeature: false,
        },
      );
    } else {
      await this.featurePostRepository.update(
        { id: Not(id) },
        {
          isFeature: false,
        },
      );
    }
  }
}
