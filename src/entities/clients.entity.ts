import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { getMachineName } from '../utils/app.utils';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { File } from './file.entity';
import { Services } from './services.entity';

@Entity({ name: 'clients' })
export class Clients extends BaseModelEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn()
  logo: File;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'industry_type',
    nullable: true,
  })
  industryType: string;

  @ManyToOne(() => Clients, (client) => client.id, { nullable: true })
  @JoinColumn({ name: 'ifm_client_id' })
  ifmClient: Clients;

  @OneToMany(() => Branch, (branch) => branch.client, { nullable: true })
  @JoinColumn()
  branches: Branch[];

  @OneToMany(() => Services, (service) => service.client, { nullable: true })
  services: Services[];

  @Column({
    type: 'nvarchar',
    length: 255,
    unique: true,
    name: 'machine_name',
    nullable: true,
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
