import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Tier } from '../common/enums/tiers';
import { getMachineName } from '../utils/app.utils';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { Services } from './services.entity';
import { States } from './states.entity';
import { User } from './user.entity';

@Entity({ name: 'cities' })
export class City extends BaseModelEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => User, (user) => user.cities, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  users?: User[];

  @ManyToOne(() => States, (state) => state.id)
  state: States;

  @Column({ type: 'varchar', length: 20 })
  tier: Tier;

  @Column({ type: 'varchar', length: 50, nullable: true })
  franchise: string;

  @Column({ type: 'int', default: 0, name: 'no_of_clients' })
  noOfClients: number;

  @OneToMany(() => Branch, (branch) => branch.city)
  branches: Branch[];

  @OneToMany(() => Services, (service) => service.city)
  services: Services[];

  @Column({
    type: 'nvarchar',
    length: 255,
    unique: true,
    name: 'machine_name',
    nullable: true,
    select: false,
  })
  machineName: string;

  @BeforeInsert()
  async beforeInsert() {
    this.machineName = getMachineName(this.name);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.machineName = getMachineName(this.name);
  }
}
