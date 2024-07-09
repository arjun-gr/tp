import { DataSource } from 'typeorm';
import { States } from '../../entities/states.entity';

export const stateProviders = [
  {
    provide: 'STATE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(States),
    inject: ['DATA_SOURCE'],
  },
];
