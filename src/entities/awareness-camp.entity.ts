import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { User } from './user.entity';

@Entity({ name: 'awareness_camp' })
export class AwarenessCamp extends BaseModelEntity {
  @ManyToOne(() => Clients, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @ManyToOne(() => City, (city) => city.services)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Branch, (branch) => branch.services)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'nvarchar', name: 'emp_type' })
  type: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'nvarchar', length: 13, name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'int', default: 0, name: 'no_of_employee' })
  noOfEmployee: number;

  @Column({ type: 'timestamp', name: 'event_date', nullable: true })
  eventDate: Date;

  @Column({ type: 'nvarchar', length: 50 })
  status: string;

  @Column({ type: 'nvarchar', length: 50 })
  clientStatus: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'completed_by' })
  completedBy: User;
}
