import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFeaturePostDto } from './dto/create-feature_post.dto';
import { UpdateFeaturePostDto } from './dto/update-feature_post.dto';
import { FeaturePostService } from './feature_post.service';

@Controller('post')
@ApiTags('feature-post')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class FeaturePostController {
  constructor(private readonly featurePostService: FeaturePostService) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createFeaturePostDto: CreateFeaturePostDto,
  ) {
    const userId = req.user.id;
    return this.featurePostService.create(createFeaturePostDto, userId);
  }

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.featurePostService.findAll(pageOptionsDto);
  }

  @Get('/all-feature-posts')
  findAllFeaturePost() {
    return this.featurePostService.getAllFeaturePost();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featurePostService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeaturePostDto: UpdateFeaturePostDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.featurePostService.update(+id, updateFeaturePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featurePostService.remove(+id);
  }
}
