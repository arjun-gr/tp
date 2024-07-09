import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../../config/typeorm.config';

export const typeOrmConnectionDataSource = new DataSource(typeOrmConfig);
