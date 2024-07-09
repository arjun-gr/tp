import { Column, Entity } from 'typeorm';
import BaseModelEntity from './base-model.entity';

@Entity({ name: 'products' })
export class Products extends BaseModelEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;
}
