import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
// import { UserRepository } from '../user/user.repository';
import { jwtConfig } from 'src/config/jwt.config';
import { CryptoService } from 'src/providers/crypto.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService, CryptoService],
})
export class AuthModule {}
