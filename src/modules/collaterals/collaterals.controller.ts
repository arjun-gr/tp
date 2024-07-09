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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Role } from '../../common/enums/roles';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollateralsService } from './collaterals.service';
import { CreateCollateralsDto } from './dto/create-collaterals.dto';
import { UpdateCollateralsDto } from './dto/update-collaterals.dto';

@Controller('collaterals')
@ApiTags('Collaterals')
@ApiBearerAuth('defaultBearerAuth')
@UseGuards(JwtAuthGuard)
export class CollateralsController {
  constructor(private collateralsService: CollateralsService) {}

  @ApiOperation({ summary: 'Get all collaterals' })
  @Get('/collaterals-list')
  getAllCollateralsByPagination(@Query() pageOptionsDto: PageOptionsDto) {
    return this.collateralsService.getAllCollateralsByPagination(
      pageOptionsDto,
    );
  }

  @ApiOperation({ summary: 'Get collateral Details by id' })
  @Get('/:id')
  getBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.collateralsService.findone(id);
  }

  @ApiOperation({ summary: 'Create Collaterals' })
  @Post()
  @Roles(Role.SUPER_ADMIN)
  createCollaterals(@Request() req: any, @Body() dto: CreateCollateralsDto) {
    const userId = req.user.id;
    return this.collateralsService.createCollaterals(dto, userId);
  }

  @ApiOperation({ summary: 'update Collaterals' })
  @Patch('/:id')
  @Roles(Role.SUPER_ADMIN, Role.CLIENT, Role.EMPLOYEE)
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCollateralsDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.collateralsService.updateCollateral(id, dto, userId);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.collateralsService.remove(+id);
  }
}
