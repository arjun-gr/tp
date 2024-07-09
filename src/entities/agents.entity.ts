import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Services } from './services.entity';

@Entity({ name: 'agents' })
export class Agents extends BaseModelEntity {
  @ManyToOne(() => Services, (service) => service.agents)
  @JoinColumn()
  service: Services;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;

  @Column({ type: 'int' })
  quantity: number;
}
