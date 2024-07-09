import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '../../decorators/user.decorator';
import { User } from '../../entities/user.entity';
import { AuthResponseCodes } from './auth.response.codes';
import { AuthService } from './auth.service';
import { AuthReqDto } from './dto/request/auth.req.dto';
import { AuthRespDto } from './dto/response/auth.resp.dto';
import { JwtAuthGuard, Public } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Get Login User Details' })
  @ApiResponse(AuthResponseCodes.BAD_REQUEST)
  @ApiResponse(AuthResponseCodes.USER_CREDENTIALS_INVALID)
  @ApiResponse(AuthResponseCodes.USER_ACCOUNT_INACTIVE)
  @HttpCode(200)
  @Get('/user')
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(JwtAuthGuard)
  async getUser(@AuthUser() user: User): Promise<any> {
    if (!user.isActive) throw AuthResponseCodes.USER_ACCOUNT_INACTIVE;
    return user;
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse(AuthResponseCodes.BAD_REQUEST)
  @ApiResponse(AuthResponseCodes.USER_CREDENTIALS_INVALID)
  @ApiResponse(AuthResponseCodes.USER_ACCOUNT_INACTIVE)
  @HttpCode(200)
  @Post('/login')
  @Public()
  async login(@Body() authReqDto: AuthReqDto): Promise<AuthRespDto> {
    return this.authService.loginUser(authReqDto);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ ...AuthResponseCodes.SUCCESS })
  @ApiResponse(AuthResponseCodes.BAD_REQUEST)
  @ApiResponse(AuthResponseCodes.ACCESS_TOKEN_INVALID)
  @HttpCode(200)
  @ApiBearerAuth('defaultBearerAuth')
  @Delete('/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
