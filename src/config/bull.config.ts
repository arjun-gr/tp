import { BullOptionsFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements BullOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  public async createBullOptions(): Promise<any> {
    console.log('createBullOptions');

    return {
      redis: {
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
      },
    };
  }
}
