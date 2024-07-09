import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { RolesGuard } from './guards/roles.guard';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AwarenessCampModule } from './modules/awareness_camp/awareness_camp.module';
import { BlogModule } from './modules/blog/blog.module';
import { CityModule } from './modules/city/city.module';
import { ClientModule } from './modules/client/client.module';
import { CollateralsModule } from './modules/collaterals/collaterals.module';
import { CommonModule } from './modules/common/common.module';
import { CountryModule } from './modules/country/country.module';
import { DatabaseModule } from './modules/database/database.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FeaturePostModule } from './modules/feature_post/feature_post.module';
import { FilesModule } from './modules/file/files.module';
import { LoggerModule } from './modules/logger/logger.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductModule } from './modules/product/product.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ServicesModule } from './modules/services/services.module';
import { StateModule } from './modules/state/state.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UsersModule } from './modules/users/users.module';
import { VideoModule } from './modules/video/video.module';
import { LoggerService } from './providers/logger.service';
import { ExcelModule } from './modules/excel/excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    CityModule,
    StateModule,
    UsersModule,
    LoggerModule,
    // RoleModule,
    // MailerModule.forRootAsync(emailConfig),
    EventEmitterModule.forRoot(),
    CountryModule,
    FilesModule,
    TicketModule,
    AwarenessCampModule,
    VideoModule,
    CollateralsModule,
    BlogModule,
    DocumentsModule,
    ServicesModule,
    AnalyticsModule,
    FeaturePostModule,
    CommonModule,
    ProductModule,
    ClientModule,
    ReportsModule,
    TasksModule,
    ScheduleModule.forRoot(),
    NotificationModule,
    ExcelModule,
  ],
  controllers: [],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
