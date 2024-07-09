import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthorizedToken } from 'src/entities/authorized-token.entity';
import { CryptoService } from 'src/providers/crypto.service';

// import { UserRepository } from '../user/user.repository';
import { Repository } from 'typeorm';
import { UserType } from '../../common/enums/user-type';
import { User } from '../../entities/user.entity';
import { isEmail } from '../../utils/app.utils';
import {
  AUTH_REPOSITORY,
  USER_REPOSITORY,
} from '../database/database.providers';
import { AuthResponseCodes } from './auth.response.codes';
import { AuthReqDto } from './dto/request/auth.req.dto';
import { JWTPayload } from './dto/request/jwt.payload';
import { AuthRespDto } from './dto/response/auth.resp.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private authRepository: Repository<AuthorizedToken>,
    @Inject(USER_REPOSITORY)
    private usersRepository: Repository<User>,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async findByAccessToken(accessTokenHash: string): Promise<AuthorizedToken> {
    return await this.authRepository.findOne({
      where: { accessTokenHash },
    });
  }

  async validateUser(userName: string, password: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: isEmail(userName) ? { email: userName } : { userName },
      select: [
        'id',
        'userName',
        'email',
        'password',
        'roles',
        'userType',
        'isActive',
        'cities',
      ],
      relations: [
        'client',
        'employeeProfile',
        'cities',
        'cities.users',
        'client.logo',
        'branch',
        'branch.city',
        'branch.city.users',
        'branch.city.users.employeeProfile',
      ],
    });
    if (user == null) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else if (user.isActive == false) {
      throw AuthResponseCodes.USER_ACCOUNT_INACTIVE;
    } else if (user.userType == UserType.Employee && !user?.cities?.length) {
      throw AuthResponseCodes.CITY_NOT_ASSIGNED;
    } else if (user.userType == UserType.Client && !user.branch) {
      throw AuthResponseCodes.BRANCH_NOT_EXISTS;
    }

    const isPasswordCorrect: boolean = await this.cryptoService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else {
      return user;
    }
  }

  async validateAccessToken(payload: any) {
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify({
        userName: payload.userName,
        id: payload.id,
        role: payload.role,
        employeeType: payload.employeeType,
      }),
    );

    const authorizedToken: AuthorizedToken =
      await this.findByAccessToken(accessTokenHash);
    if (authorizedToken == null) {
      throw AuthResponseCodes.ACCESS_TOKEN_INVALID;
    }
  }

  async loginUser(authReqDto: AuthReqDto): Promise<AuthRespDto> {
    const user: User = await this.validateUser(
      authReqDto.userName,
      authReqDto.password,
    );
    const payload = {
      userName: user.userName,
      id: user.id,
      role: user.userType,
      employeeType: user.employeeProfile ? user.employeeProfile.type : null,
    };

    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify(payload),
    );

    const authorizedToken: AuthorizedToken = new AuthorizedToken();
    authorizedToken.accessTokenHash = accessTokenHash;
    authorizedToken.refreshTokenHash = '';
    authorizedToken.user = user;
    await this.deleteTokenByUser(user);
    await this.authRepository.save(authorizedToken);

    const authRespDto: AuthRespDto = new AuthRespDto(user.id, accessToken);

    return authRespDto;
  }

  async logout(jwtPayload: JWTPayload) {
    const user: User = await this.usersRepository.findOne({
      where: { id: jwtPayload.id },
    });
    if (user != null) {
      await this.deleteTokenByUser(user);
    }
  }

  async deleteTokenByUser(user: User): Promise<unknown> {
    const authToken: AuthorizedToken = await this.authRepository.findOne({
      where: { user_id: user.id },
    });
    if (!authToken?.id) return false;
    return await this.authRepository.delete(authToken.id);
  }
}
