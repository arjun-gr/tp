import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';

@Entity({ name: 'spocs' })
export class SPOCS extends BaseModelEntity {
  @ManyToOne(() => Branch, (branch) => branch.spocs)
  @JoinColumn()
  branch: Branch;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'nvarchar', length: 13, nullable: true })
  phoneNumber: string;
}
