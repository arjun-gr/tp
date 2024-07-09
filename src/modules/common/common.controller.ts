import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getSiteMetaData } from '../../utils/app.utils';
import { Public } from '../auth/jwt-auth.guard';

@Controller('common')
@ApiTags('Common')
@Public()
export class CommonController {
  @ApiOperation({ summary: 'Get Site Meta' })
  @Get('/meta')
  async getSiteMetaData(@Query('url') url: string) {
    return await getSiteMetaData(url);
  }
}
