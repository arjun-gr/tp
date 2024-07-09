import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import appConfig from './app.config';

export const defaultConfig = {
  type: 'mysql',
  host: appConfig().database.host,
  port: appConfig().database.port,
  username: appConfig().database.username,
  password: appConfig().database.password,
  database: appConfig().database.primarydb,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  name: 'primarydb',
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    const ssl =
      appConfig().config.CERTIFICATE_AUTHORITY !== ''
        ? {
            ssl: {
              ca: './certificates/ca.pem',
              cert: './certificates/server-cert.pem',
              key: './certificates/server-key.pem',
              rejectUnauthorized: false,
            },
          }
        : undefined;
    return {
      ...defaultConfig,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      cli: {
        migrationsDir: __dirname + '/../migrations',
      },
      extra: {
        charset: 'utf8mb4_unicode_520_ci',
      },
      synchronize: false,
      logging: false,
      //...ssl,
    } as TypeOrmModuleAsyncOptions;
  },
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource(options).initialize();
    return dataSource;
  },
};

/*This config is used by the migration script -> npm run migration:run which is not integrated with nestjs
but instead uses the typeorm.config - migrations.ts file*/
export const typeOrmConfig: DataSourceOptions = {
  ...defaultConfig,
  name: 'primarydb',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
  extra: {
    charset: 'utf8mb4_unicode_520_ci',
  },
} as DataSourceOptions;
