import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JWTPayload } from './dto/request/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(
        process.cwd() + configService.get('JWT_PRIVATE_KEY'),
        'utf8',
      ),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    await this.authService.validateAccessToken(payload);
    const jwtPayload: JWTPayload = new JWTPayload(
      payload.id,
      payload.userName,
      payload.role,
      payload.employeeType,
    );

    return jwtPayload;
  }
}
