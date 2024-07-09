import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { getMachineName } from '../utils/app.utils';
import BaseModelEntity from './base-model.entity';
import { City } from './city.entity';
import { Country } from './country.entity';

@Entity({ name: 'states' })
export class States extends BaseModelEntity {
  @OneToMany(() => City, (city) => city.state)
  city: City[];

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;

  @Column({ type: 'varchar', length: 50 })
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
