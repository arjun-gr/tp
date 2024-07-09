import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ServiceStatus } from '../common/enums/services';
import { Agents } from './agents.entity';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { Purchase } from './purchase.entity';
import { User } from './user.entity';

@Entity({ name: 'services' })
export class Services extends BaseModelEntity {
  @ManyToOne(() => User, (user) => user.services)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Clients, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @ManyToOne(() => City, (city) => city.services)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Branch, (branch) => branch.services)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => Purchase, (purchase) => purchase.id)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @Column({ type: 'nvarchar', length: 50 })
  type: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'date', name: 'serviced_date', nullable: true })
  serviceDate: Date;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'enum', enum: ServiceStatus })
  status: string;

  @Column({ type: 'date', nullable: true, name: 'reschedule_date' })
  rescheduleDate: Date;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'reschedule_reason',
    nullable: true,
  })
  rescheduleReason: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'reschedule_by' })
  rescheduleBy: User;

  @Column({ type: 'timestamp', name: 'reschedule_at', nullable: true })
  rescheduleAt: Date;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'cancelled_reason',
    nullable: true,
  })
  cancelledReason: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'cancelled_by' })
  cancelledBy: User;

  @Column({ type: 'timestamp', name: 'cancelled_at', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'completed_by' })
  completedBy: User;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'vehicle_used',
  })
  vehicleUsed: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'other_vehicle_used',
  })
  otherVehicleDetail: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'bin_maintenace_part',
  })
  binMaintenanceParts: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'bin_maintenace_other_part',
  })
  binMaintenanceOtherPart: string;

  @Column({ type: 'int', name: 'bin_part_qty', nullable: true })
  binMaintenancePartQty: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'waste_pad_collection',
    comment: 'Waste pad collection quantity in gram',
  })
  wastePadCollection: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'total_service_cost',
  })
  totalServiceCost: number;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'is_invoice_submitted',
  })
  isInvoiceSubmitted: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
    name: 'invoice_other_detail',
  })
  invoiceOther: string;

  @OneToMany(() => Agents, (agent) => agent.service)
  @JoinColumn()
  agents: Agents[];

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
    name: 'client_onboarding_product',
  })
  clientOnboardingProduct: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  stickers: string;

  @Column({ type: 'date', nullable: true, name: 'service_at' })
  serviceAt: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'invoice_amount',
    nullable: true,
    default: 0.0,
  })
  invoiceAmount: number;
}
