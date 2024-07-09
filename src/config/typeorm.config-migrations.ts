import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';
export const databaseProviders = new DataSource(typeOrmConfig);
