import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private saltRounds = 12;

  async comparePassword(
    toCompare: string,
    comparedTo: string,
  ): Promise<boolean> {
    return bcrypt.compare(toCompare, comparedTo);
  }

  async generatePassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  generateToken(): string {
    const buffer = crypto.randomBytes(48);
    const token = crypto.createHash('sha1').update(buffer).digest('hex');
    return token;
  }

  generateHash(data: string): string {
    const token = crypto.createHash('sha1').update(data).digest('hex');
    return token;
  }

  generateRandomString(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
