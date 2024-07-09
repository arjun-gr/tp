import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from 'src/providers/crypto.service';
import { DatabaseModule } from '../database/database.module';
import { FilesController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [FilesController],
  providers: [FileService, CryptoService],
  exports: [FileService],
})
export class FilesModule {}
