import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { Branch } from './branch.entity';
import { Products } from './product.entity';
import { Purchase } from './purchase.entity';

@Entity({ name: 'branch_product' })
export class BranchProduct extends BaseModelEntity {
  @ManyToOne(() => Purchase, (purchase) => purchase.branchProduct)
  @JoinColumn()
  purchase: Purchase;

  @ManyToOne(() => Products, (product) => product.id)
  @JoinColumn()
  product: Products;

  @ManyToOne(() => Branch, (branch) => branch.branchProduct)
  @JoinColumn()
  branch: Branch;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({
    type: 'nvarchar',
    length: 50,
    name: 'service_type',
    nullable: true,
  })
  serviceType: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    name: 'deployment_type',
    nullable: true,
  })
  deploymentType: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'service_cost',
    comment: 'Service cost without gst per piece',
    nullable: true,
    default: 0.0,
  })
  serviceCost: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'rental_amount',
    nullable: true,
    default: 0.0,
  })
  rentalAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'buyout_amount',
    nullable: true,
    default: 0.0,
  })
  buyoutAmount: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'refilling_quantity',
  })
  refillingQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'refilling_amount',
    nullable: true,
    default: 0.0,
  })
  refillingAmount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_service_cost',
    nullable: true,
    default: 0.0,
  })
  totalCost: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'sim_brand' })
  simCardBrand: string;

  @Column({
    type: 'int',
    name: 'sim_recharge_price',
    nullable: true,
  })
  simCardRechargePrice: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'sanitary_pad_brand',
    nullable: true,
  })
  sanitaryPadBrand: string;

  @Column({ type: 'bigint', nullable: true, name: 'pad_quantity' })
  padQuantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'pad_cost',
    nullable: true,
    default: 0.0,
  })
  padCost: number;

  @Column({ type: 'varchar', name: 'pad_type', length: 50, nullable: true })
  padType: string;

  @Column({ type: 'nvarchar', length: 15, name: 'sim_number', nullable: true })
  simNumber: string;
}
