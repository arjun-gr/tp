import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { getMachineName } from '../utils/app.utils';
import BaseModelEntity from './base-model.entity';
import { States } from './states.entity';

@Entity({ name: 'country' })
export class Country extends BaseModelEntity {
  @OneToMany(() => States, (state) => state.country)
  states: States[];

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    unique: true,
    name: 'machine_name',
    nullable: true,
    select: false
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
