import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AwarenessCamp } from './awareness-camp.entity';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { EmployeeProfile } from './employee.entity';
import { Roles } from './roles.entity';
import { Services } from './services.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'users' })
export class User extends BaseModelEntity {
  @Column({ type: 'nvarchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true, name: 'user_name' })
  userName: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, name: 'user_type' })
  userType: string;

  @ManyToMany(() => City, (city) => city.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinTable({
    name: 'user_city',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'city_id',
      referencedColumnName: 'id',
    },
  })
  cities: City[];

  @ManyToOne(() => Clients, (client) => client.id, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @OneToOne(() => Branch, (branch) => branch.user)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToOne(() => EmployeeProfile, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'employee_id' })
  employeeProfile: EmployeeProfile;

  @ManyToMany(() => Roles, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  public roles: Roles[];

  @ManyToMany(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_assignees',
    joinColumn: {
      name: 'city_manager_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'executive_id',
      referencedColumnName: 'id',
    },
  })
  public assignees: User[];

  @OneToMany(() => AwarenessCamp, (awareness) => awareness.id)
  @JoinColumn({ name: 'awareness_camp_id' })
  awarenessCamps: AwarenessCamp[];

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket[];

  @OneToMany(() => Services, (service) => service.user)
  services: Services[];
}
