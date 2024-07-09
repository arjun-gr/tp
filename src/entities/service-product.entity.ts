import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { BranchProduct } from './branch-products.entity';
import { Products } from './product.entity';
import { Services } from './services.entity';

@Entity({ name: 'service_product' })
export class ServiceProduct extends BaseModelEntity {
  @ManyToOne(() => Services, (service) => service.id)
  @JoinColumn()
  service: Services;

  @ManyToOne(() => Products, (product) => product.id)
  @JoinColumn()
  product: Products;

  @Column({ type: 'int', name: 'total_quantity', nullable: true })
  totalQuantity: number;

  @Column({ type: 'int', name: 'installed_quantity', nullable: true })
  installedQuantity: number;

  @Column({ type: 'int', name: 'serviced_quantity', nullable: true })
  serviceQuantity: number;

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
    name: 'service_frequency',
    nullable: true,
  })
  serviceFrequency: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'invoice_amount',
    nullable: true,
    default: 0.0,
  })
  invoiceAmount: number;

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

  @Column({
    type: 'nvarchar',
    length: 255,
    name: 'invoice_number',
    nullable: true,
  })
  invoiceNumber: string;

  @Column({ type: 'int', nullable: true, name: '5_rs_pad_ref_quantity' })
  padRefillingQuantity5Rs: number;

  @Column({ type: 'int', nullable: true, name: '10_rs_pad_ref_quantity' })
  padRefillingQuantity10Rs: number;

  @Column({ type: 'int', nullable: true, name: '5_rs_coin_coll_quantity' })
  coinRefillingCollection5Rs: number;

  @Column({ type: 'int', nullable: true, name: '10_rs_coin_coll_quantity' })
  coinRefillingCollection10Rs: number;

  @Column({ type: 'int', nullable: true, name: '5_rs_pad_sold_quantity' })
  padSoldQuantity5Rs: number;

  @Column({ type: 'int', nullable: true, name: '10_rs_pad_sold_quantity' })
  padSoldQuantity10Rs: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'pad_sold_invoice_amount',
    nullable: true,
  })
  padSoldInvAmount: number;

  @Column({ type: 'nvarchar', length: 50, name: 'sim_brand', nullable: true })
  simBrand: string;

  @Column({ type: 'text', name: 'sim_number', nullable: true })
  simNumber: string;

  @Column({ type: 'int', name: 'sim_recharge_price', nullable: true })
  simRechargePrice: number;

  @Column({ type: 'nvarchar', length: 50, name: 'pad_brand', nullable: true })
  padBrand: string;

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_cost',
    nullable: true,
    default: 0.0,
  })
  totalCost: number;

  @Column({ type: 'varchar', name: 'pad_type', length: 50, nullable: true })
  padType: string;

  @Column({
    type: 'text',
    name: 'vm_machine_number',
    nullable: true,
  })
  vmMachineNumber: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'vm_maintenance_part',
  })
  vmMaintenanceParts: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    nullable: true,
    name: 'vm_maintenance_other_part',
  })
  vmMaintenancePartOther: string;

  @Column({ type: 'text', name: 'vm_part_qty', nullable: true })
  vmMaintenancePartQty: string;

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'actual_cost',
    nullable: true,
    default: 0.0,
  })
  actualCost: number;

  @ManyToOne(() => BranchProduct, (branchProduct) => branchProduct.id)
  @JoinColumn({ name: 'branch_product_id' })
  branchProduct: BranchProduct;
}
