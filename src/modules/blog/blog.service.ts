import { Inject, Injectable } from '@nestjs/common';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { Blog } from '../../entities/blog.entity';
import { BLOG_REPOSITORY } from '../database/database.providers';
import { UsersService } from '../users/users.service';
import { BlogResponseCodes } from './blog.response.code';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private userService: UsersService,
    @Inject(BLOG_REPOSITORY)
    private blogRepository: Repository<Blog>,
  ) {}

  async createBlog(dto: CreateBlogDto, userId: number) {
    const user = await this.userService.throwIfUserNotExists(userId);
    try {
      if (dto.isFeature) await this.removeFeatureBlogIfAlreadyPresent();
      const blog = new Blog();
      blog.heroImage = dto.heroImage;
      blog.content = dto.content;
      blog.title = dto.title;
      blog.teaserImage = dto.teaserImage;
      blog.publishedAt = dto.published ? new Date() : null;
      blog.publishedBy = dto.published ? user : null;
      blog.isFeature = dto.isFeature;
      return this.blogRepository.save(blog);
    } catch (error) {
      console.log('BlogService :: createBlog ==>', error);
      throw new Error(error);
    }
  }

  async updateBlog(dto: UpdateBlogDto, id: number, userId: any) {
    await this.throwIfBlogNotExists(id);
    if (dto.isFeature) await this.removeFeatureBlogIfAlreadyPresent(id);
    await this.blogRepository.update(id, {
      // ...dto,
      title: dto.title,
      content: dto.content,
      heroImage: dto.heroImage,
      teaserImage: dto.teaserImage,
      publishedAt: dto.published ? new Date() : null,
      publishedBy: dto.published ? userId : null,
      isFeature: dto.isFeature,
    });
    return { message: 'Blog updated successfully' };
  }

  async getAllBlogsByPagination(pageOptionsDto: PageOptionsDto) {
    const search = pageOptionsDto?.search;

    const [list, count] = await this.blogRepository.findAndCount({
      where: {
        isActive: true,
        title:
          search && search.trim().length > 0
            ? ILike(`%${search}%`)
            : ILike(`%%`),
      },
      relations: {
        heroImage: true,
        teaserImage: true,
      },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });

    return new PageDto(list, pageMetaDto);
  }

  async getBlogById(blogId: number) {
    const blog = await this.throwIfBlogNotExists(blogId);
    return blog;
  }

  async remove(id: number) {
    const blog = await this.throwIfBlogNotExists(id);
    await this.blogRepository.update(id, { isActive: false });
    return this.blogRepository.softDelete(id);
  }

  private async throwIfBlogNotExists(id: number) {
    const blog = await this.blogRepository.findOne({
      where: { id, isActive: true },
      relations: {
        heroImage: true,
        teaserImage: true,
      },
    });
    if (!blog) {
      throw BlogResponseCodes.BLOG_NOT_EXISTS;
    }
    return blog;
  }

  async getAllBlogList(pageOptionsDto: PageOptionsDto, status: boolean) {
    const search = pageOptionsDto?.search;
    let where: any = {
      isActive: true,
      title:
        search && search.trim().length > 0 ? ILike(`%${search}%`) : ILike(`%%`),
      publishedAt: status ? Not(IsNull()) : IsNull(),
    };

    if (status == undefined) delete where.publishedAt;
    const [list, count] = await this.blogRepository.findAndCount({
      where: where,
      relations: {
        heroImage: true,
        teaserImage: true,
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        content: true,
        publishedAt: true,
        heroImage: {
          id: true,
          url: true,
          mimetype: true,
        },
        teaserImage: {
          id: true,
          url: true,
          mimetype: true,
        },
        isFeature: true,
      },
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });

    return new PageDto(list, pageMetaDto);
  }

  async removeFeatureBlogIfAlreadyPresent(id?: number) {
    if (!id) {
      await this.blogRepository.update({}, { isFeature: false });
    } else {
      await this.blogRepository.update(
        { id: Not(id) },
        {
          isFeature: false,
        },
      );
    }
  }
}
