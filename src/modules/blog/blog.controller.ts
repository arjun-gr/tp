import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
@ApiTags('Blog')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private blogService: BlogService) {}

  @ApiOperation({ summary: 'Get all blogs by pagination' })
  @Get('blog-list')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  getAllBlogsByPagination(@Query() pageOptionsDto: PageOptionsDto) {
    return this.blogService.getAllBlogsByPagination(pageOptionsDto);
  }

  @ApiOperation({ summary: 'Get all blogs by pagination (For Admin)' })
  @Get('getAllBlogList')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT)
  @ApiQuery({
    name: 'publish',
    type: 'boolean',
    required: false,
  })
  getAllBlogList(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('publish') publish: boolean,
  ) {
    return this.blogService.getAllBlogList(pageOptionsDto, publish);
  }

  @ApiOperation({ summary: 'Get Blog Details by id' })
  @Get('/:id')
  getBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogById(id);
  }

  @ApiOperation({ summary: 'Create Blog by Admin' })
  @Post()
  @Roles(Role.SUPER_ADMIN)
  createBlog(@Request() req: any, @Body() dto: CreateBlogDto) {
    const userId = req.user.id;
    return this.blogService.createBlog(dto, userId);
  }

  @ApiOperation({ summary: 'Update Blog by Admin' })
  @Patch('/:id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.blogService.updateBlog(dto, id, userId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
