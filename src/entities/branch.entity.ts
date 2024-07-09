import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { BranchProduct } from './branch-products.entity';
import { City } from './city.entity';
import { Clients } from './clients.entity';
import { Purchase } from './purchase.entity';
import { Services } from './services.entity';
import { SPOCS } from './spoc.entity';
import { User } from './user.entity';

@Entity({ name: 'branch' })
export class Branch extends BaseModelEntity {
  @Column({ type: 'nvarchar', length: 255, nullable: true })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'billing_address',
    nullable: true,
  })
  billingAddress: string;

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'site_address',
    nullable: true,
  })
  siteAddress: string;

  @Column({ type: 'int', default: null, name: 'pincode', nullable: true })
  pincode: number;

  @Column({
    type: 'nvarchar',
    length: 50,
    default: null,
    name: 'gst_number',
    nullable: true,
  })
  gstNumber: string;

  @Column({ type: 'int', default: null, name: 'female_count', nullable: true })
  femaleCount: number;

  @Column({ type: 'date', name: 'contract_start_date', nullable: true })
  contractStartDate: Date;

  @Column({ type: 'date', name: 'contract_end_date', nullable: true })
  contractEndDate: Date;

  @Column({
    type: 'int',
    default: null,
    name: 'contract_period',
    nullable: true,
  })
  contractPeriod: number;

  @Column({ type: 'nvarchar', length: 150, name: 'sales_lead', nullable: true })
  salesLead: string;

  @ManyToOne(() => City, (city) => city.id, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Clients, (client) => client.branches)
  @JoinColumn({ name: 'client_id' })
  client: Clients;

  @OneToMany(() => SPOCS, (spocs) => spocs.branch, { nullable: true })
  @JoinColumn({ name: 'spocs_id' })
  spocs: SPOCS[];

  @OneToOne(() => User, (user) => user.branch)
  @JoinColumn()
  user: User;

  @OneToMany(() => Services, (service) => service.branch)
  services: Services[];

  @OneToMany(() => Purchase, (purchase) => purchase.branch, { nullable: true })
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase[];

  @OneToMany(() => Purchase, (purchase) => purchase.activePurchase, {
    nullable: true,
  })
  @JoinColumn()
  activePurchase: Purchase[];

  @OneToMany(() => BranchProduct, (branchProduct) => branchProduct.branch, {
    nullable: true,
  })
  @JoinColumn()
  branchProduct: BranchProduct;

  @Column({ type: 'timestamp', name: 'deactivated_at', default: null })
  deactivatedAt: Date;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
    name: 'deactivate_reason',
  })
  deactivateReason: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deactivated_by' })
  deactivatedBy: User;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
    name: 'delete_reason',
  })
  deletedReason: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;
}
