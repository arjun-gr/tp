import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity({ name: 'analytics' })
export class Analytics extends BaseModelEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', nullable: true, default: 0 })
  pads_collected: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0.0,
  })
  material_processed_kg: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0.0,
  })
  landfill_area_saved_liters: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0.0,
  })
  carbon_equivalents_conserved_kg: number;

  @ManyToOne(() => Clients, (client) => client.id)
  @JoinColumn({ name: 'client' })
  client: Clients;

  @ManyToOne(() => Branch, (branch) => branch.id)
  @JoinColumn({ name: 'branch' })
  branch: Branch;

  @ManyToOne(() => City, (city) => city.id, { nullable: true })
  @JoinColumn({ name: 'city' })
  city: City;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  total_complaints: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  resolved_complaints: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  pending_complaints: number;

  @Column({
    type: 'bigint',
    name: 'complaint_tat_time',
    comment: 'TAT time in minutes',
    nullable: true,
    default: 0,
  })
  complaintsTatTime: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  total_services: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  completed_services: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  pending_services: number;

  @Column({ type: 'bigint', name: 'no_of_bins', nullable: true, default: 0 })
  noOfBins: number;

  @Column({
    type: 'bigint',
    name: 'buyout_product',
    nullable: true,
    default: 0,
  })
  buyoutProduct: number;

  @Column({
    type: 'bigint',
    name: 'no_of_monthly_services',
    nullable: true,
    default: 0,
  })
  noOfMonthlyServices: number;
}
