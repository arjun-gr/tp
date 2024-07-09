import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { getMachineName } from '../utils/app.utils';
import BaseModelEntity from './base-model.entity';

@Entity({ name: 'roles' })
export class Roles extends BaseModelEntity {
  @Column({ type: 'nvarchar', length: 50, unique: true })
  name: string;

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
