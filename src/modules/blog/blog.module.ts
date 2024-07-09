import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
