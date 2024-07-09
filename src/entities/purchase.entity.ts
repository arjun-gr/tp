import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseModelEntity from './base-model.entity';
import { BranchProduct } from './branch-products.entity';
import { Branch } from './branch.entity';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity({ name: 'purchase' })
export class Purchase extends BaseModelEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'date', name: 'installation_date', nullable: true })
  installationDate: Date;

  @Column({
    type: 'nvarchar',
    length: 50,
    default: null,
    name: 'so_number',
    nullable: true,
  })
  soNumber: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    default: null,
    name: 'po_number',
    nullable: true,
  })
  poNumber: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    name: 'payment_terms',
    nullable: true,
  })
  paymentTerms: string;

  @Column({ type: 'nvarchar', length: 50, name: 'billing_faq', nullable: true })
  billingFaq: string;

  @Column({ type: 'date', name: 'so_received_date', nullable: true })
  soReceivedDate: Date;

  @Column({ type: 'date', name: 'contract_start_date', nullable: true })
  contractStartDate: Date;

  @Column({ type: 'date', name: 'contract_end_date', nullable: true })
  contractEndDate: Date;

  @ManyToOne(() => Branch, (branch) => branch.purchase)
  @JoinColumn()
  branch: Branch;

  @OneToMany(() => BranchProduct, (branchProduct) => branchProduct.purchase)
  @JoinColumn()
  branchProduct: BranchProduct[];

  @ManyToOne(() => Branch, (branch) => branch.activePurchase)
  @JoinColumn()
  activePurchase: Branch;

  @OneToMany(() => File, (file) => file.id, { nullable: true })
  @JoinColumn({ name: 'purchase_order' })
  purchaseOrder: File[];

  @OneToMany(() => File, (file) => file.id, { nullable: true })
  @JoinColumn({ name: 'sales_order' })
  salesOrder: File[];

  @OneToMany(() => File, (file) => file.id, { nullable: true })
  @JoinColumn()
  agreement: File[];

  @OneToMany(() => File, (file) => file.id, { nullable: true })
  @JoinColumn({ name: 'work_authorization_letter' })
  workAuthorizationLetter: File[];

  @OneToMany(() => File, (file) => file.id, { nullable: true })
  @JoinColumn({ name: 'email_confirmation' })
  emailConfirmation: File[];

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
    name: 'delete_reason',
  })
  deleteReason: string;
}
