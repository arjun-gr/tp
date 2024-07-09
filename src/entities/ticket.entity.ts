import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { File } from './file.entity';
import { Products } from './product.entity';
import { User } from './user.entity';

@Entity({ name: 'ticket' })
export class Ticket extends BaseModelEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'nvarchar', length: 50, name: 'type' })
  type: string;

  @ManyToOne(() => Products, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @Column({ type: 'nvarchar', length: 50, name: 'ticket_status' })
  ticketStatus: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'nvarchar', length: 255 })
  description: string;

  @ManyToOne(() => Clients, (client) => client.id)
  @JoinColumn({ name: 'client' })
  client: Clients;

  @ManyToOne(() => Branch, (branch) => branch.id)
  @JoinColumn({ name: 'branch' })
  branch: Branch;

  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn({ name: 'city' })
  city: City;

  @ManyToOne(() => User, (user) => user.ticket)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => File, (file) => file.ticket, { nullable: true })
  images: File[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'completed_by' })
  completedBy: User;

  @Column({ type: 'timestamp', name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'nvarchar', length: 50, name: 'complaint_code' })
  complaintCode: string;
}
