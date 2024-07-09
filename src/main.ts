import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './providers/logger.service';
import { SwaggerBuilder } from './providers/swagger.builder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  const loggerService = app.get(LoggerService);
  const configService = app.get(ConfigService);

  // app.useGlobalFilters(new AllExceptionsFilter(loggerService));
  // app.useGlobalInterceptors(
  //   // new AuthorizationInterceptor(),
  //   new LoggingInterceptor(loggerService, configService),
  // );

  //this required before view engine setup
  hbs.registerPartials(__dirname + '/assets/partials');
  // view engine setup
  app.set('view engine', 'hbs');
  //Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(helmet());
  app.enableCors();
  //Swagger api documentation
  SwaggerBuilder.build(app);
  await app.listen(configService.get('APP_PORT', 3000));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
