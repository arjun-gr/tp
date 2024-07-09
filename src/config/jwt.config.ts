import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import * as fs from 'fs';
import { TimeoutConfig } from './timeout.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const options: JwtModuleOptions = {
      privateKey: fs.readFileSync(
        process.cwd() + configService.get('JWT_PRIVATE_KEY'),
        'utf8',
      ),
      publicKey: fs.readFileSync(
        process.cwd() + configService.get('JWT_PUBLIC_KEY'),
        'utf8',
      ),
      signOptions: {
        expiresIn: `${TimeoutConfig.ACCESS_TOKEN_DURATION}s`,
        algorithm: 'RS256',
      },
    };
    return options;
  },
  inject: [ConfigService],
};
